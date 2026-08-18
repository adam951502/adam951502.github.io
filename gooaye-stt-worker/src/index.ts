import { Buffer } from "node:buffer";

const MODEL = "@cf/openai/whisper-large-v3-turbo" as const;
const GOOAYE_SHOW_UUID = "954689a5-3096-43a4-a80b-7810b219cef3";
const SOUNDON_RSS_HOST = "rss.soundon.fm";
const SOUNDON_CDN_HOST = "filesb.soundon.fm";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type WorkerEnv = Env & {
  INVOCATION_SECRET: string;
};

type SttJob = {
  jobId: string;
  episode: string | null;
  soundOnUuid: string;
  timestamp: string | null;
  durationSeconds: number | null;
  createdAt: string;
};

type StoredJob = {
  status: "queued" | "processing" | "done" | "partial" | "error";
  jobId: string;
  episode: string | null;
  soundOnUuid: string;
  createdAt: string;
  updatedAt: string;
  result?: unknown;
  error?: string;
};

type NormalizedSegment = {
  chunkIndex: number;
  start: number | null;
  end: number | null;
  text: string;
  timestampQuality: "approximate-byte-offset" | "chunk-local-only";
};

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function positiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function secretsMatch(provided: string, expected: string): Promise<boolean> {
  if (!provided || !expected) return false;
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(provided)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}

async function authorize(url: URL, env: WorkerEnv): Promise<string | null> {
  const token = url.searchParams.get("token") ?? "";
  if (!(await secretsMatch(token, env.INVOCATION_SECRET ?? ""))) return null;
  return token;
}

function parseDuration(value: string | null): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0 || parsed > 21_600) {
    throw new Error("durationSeconds must be between 0 and 21600");
  }
  return parsed;
}

function buildCanonicalAudioUrl(uuid: string, timestamp: string | null): string {
  if (!UUID_RE.test(uuid)) throw new Error("Invalid SoundOn UUID");
  const url = new URL(
    `https://${SOUNDON_RSS_HOST}/rssf/${GOOAYE_SHOW_UUID}/feedurl/${uuid}/rssFileVip.mp3`,
  );
  if (timestamp) {
    if (!/^\d{8,20}$/.test(timestamp)) throw new Error("timestamp must contain only digits");
    url.searchParams.set("timestamp", timestamp);
  }
  return url.toString();
}

function assertAllowedRedirect(urlText: string): URL {
  const url = new URL(urlText);
  if (url.protocol !== "https:") throw new Error("Only HTTPS audio redirects are allowed");
  if (url.hostname !== SOUNDON_RSS_HOST && url.hostname !== SOUNDON_CDN_HOST) {
    throw new Error(`Unexpected audio redirect host: ${url.hostname}`);
  }
  return url;
}

async function fetchAudio(
  sourceUrl: string,
  maxBytes: number,
): Promise<{ response: Response; finalUrl: string; redirectChain: string[]; declaredBytes: number | null }> {
  let current = assertAllowedRedirect(sourceUrl);
  const redirectChain = [current.toString()];

  for (let hop = 0; hop <= 5; hop += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        Accept: "audio/mpeg,audio/*;q=0.9,application/octet-stream;q=0.5",
        "User-Agent": "gooaye-stt-backend/1.0",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`Redirect ${response.status} missing Location header`);
      if (hop === 5) throw new Error("Too many audio redirects");
      current = assertAllowedRedirect(new URL(location, current).toString());
      redirectChain.push(current.toString());
      continue;
    }

    if (!response.ok) throw new Error(`Audio download failed with HTTP ${response.status}`);

    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    if (!contentType.startsWith("audio/") && contentType !== "application/octet-stream") {
      throw new Error(`Unexpected audio content type: ${contentType}`);
    }

    const declared = Number(response.headers.get("content-length") ?? "0");
    const declaredBytes = Number.isFinite(declared) && declared > 0 ? declared : null;
    if (declaredBytes !== null && declaredBytes > maxBytes) {
      throw new Error(`Audio exceeds maximum size (${declaredBytes} > ${maxBytes})`);
    }

    return { response, finalUrl: current.toString(), redirectChain, declaredBytes };
  }

  throw new Error("Unable to resolve SoundOn audio");
}

function objectText(value: unknown, key: string): string {
  if (typeof value !== "object" || value === null) return "";
  const raw = (value as Record<string, unknown>)[key];
  return typeof raw === "string" ? raw : "";
}

function objectNumber(value: unknown, key: string): number | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = (value as Record<string, unknown>)[key];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : null;
}

function normalizeSegments(
  result: unknown,
  chunkIndex: number,
  estimatedChunkStartSeconds: number | null,
): NormalizedSegment[] {
  if (typeof result !== "object" || result === null) return [];
  const rawSegments = (result as Record<string, unknown>).segments;
  if (!Array.isArray(rawSegments)) return [];

  return rawSegments.flatMap((segment) => {
    const text = objectText(segment, "text").trim();
    if (!text) return [];
    const localStart = objectNumber(segment, "start");
    const localEnd = objectNumber(segment, "end");
    const offset = estimatedChunkStartSeconds;

    return [{
      chunkIndex,
      start: localStart === null ? null : localStart + (offset ?? 0),
      end: localEnd === null ? null : localEnd + (offset ?? 0),
      text,
      timestampQuality: offset === null ? "chunk-local-only" : "approximate-byte-offset",
    } satisfies NormalizedSegment];
  });
}

async function transcribeAudio(job: SttJob, env: WorkerEnv): Promise<unknown> {
  const maxAudioBytes = positiveInt(env.MAX_AUDIO_BYTES, 80 * 1024 * 1024);
  const chunkBytes = positiveInt(env.CHUNK_BYTES, 1024 * 1024);
  const sourceUrl = buildCanonicalAudioUrl(job.soundOnUuid, job.timestamp);
  const audio = await fetchAudio(sourceUrl, maxAudioBytes);
  const fullBuffer = await audio.response.arrayBuffer();

  if (fullBuffer.byteLength === 0) throw new Error("Downloaded audio is empty");
  if (fullBuffer.byteLength > maxAudioBytes) {
    throw new Error(`Audio exceeds maximum size (${fullBuffer.byteLength} > ${maxAudioBytes})`);
  }

  const totalBytes = fullBuffer.byteLength;
  const totalChunks = Math.ceil(totalBytes / chunkBytes);
  const transcriptParts: string[] = [];
  const segments: NormalizedSegment[] = [];
  const failures: Array<{ chunkIndex: number; startByte: number; endByte: number; error: string }> = [];
  let successfulBytes = 0;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const startByte = chunkIndex * chunkBytes;
    const endByte = Math.min(startByte + chunkBytes, totalBytes);
    const chunk = fullBuffer.slice(startByte, endByte);
    const estimatedChunkStartSeconds = job.durationSeconds
      ? job.durationSeconds * (startByte / totalBytes)
      : null;

    try {
      const result = await env.AI.run(MODEL, {
        audio: Buffer.from(chunk).toString("base64"),
        task: "transcribe",
        language: "zh",
        vad_filter: true,
        condition_on_previous_text: false,
        initial_prompt: "繁體中文財經 Podcast《股癌》，主持人謝孟恭。請保留英文公司名、Ticker、產品名、技術詞與數字。",
      });

      const text = objectText(result, "text").trim();
      if (text) transcriptParts.push(text);
      segments.push(...normalizeSegments(result, chunkIndex, estimatedChunkStartSeconds));
      successfulBytes += chunk.byteLength;
    } catch (error) {
      failures.push({
        chunkIndex,
        startByte,
        endByte,
        error: error instanceof Error ? error.message : "Unknown Workers AI error",
      });
    }
  }

  const byteCoveragePercent = Number(((successfulBytes / totalBytes) * 100).toFixed(2));
  return {
    provider: "cloudflare-workers-ai",
    model: MODEL,
    language: "zh",
    episode: job.episode,
    soundOnUuid: job.soundOnUuid,
    transcript: transcriptParts.join("\n").trim(),
    segments,
    audio: {
      canonicalUrl: sourceUrl,
      finalUrl: audio.finalUrl,
      redirectChain: audio.redirectChain,
      bytes: totalBytes,
      declaredBytes: audio.declaredBytes,
      durationSeconds: job.durationSeconds,
    },
    chunking: {
      chunkBytes,
      totalChunks,
      successfulChunks: totalChunks - failures.length,
      failedChunks: failures.length,
      failures,
    },
    coverage: {
      successfulBytes,
      totalBytes,
      byteCoveragePercent,
      timestampQuality: job.durationSeconds ? "approximate-byte-proportional" : "chunk-local-only",
    },
    completedAt: new Date().toISOString(),
  };
}

async function getStoredJob(env: WorkerEnv, jobId: string): Promise<StoredJob | null> {
  return env.JOBS.get<StoredJob>(`job:${jobId}`, "json");
}

async function saveStoredJob(env: WorkerEnv, job: StoredJob): Promise<void> {
  const ttl = positiveInt(env.RESULT_TTL_SECONDS, 7 * 24 * 60 * 60);
  await env.JOBS.put(`job:${job.jobId}`, JSON.stringify(job), { expirationTtl: ttl });
}

async function submitJob(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  const token = await authorize(url, env);
  if (!token) return json({ error: "Unauthorized" }, 401);

  const { searchParams, origin } = url;
  const soundOnUuid = searchParams.get("uuid") ?? "";
  const timestamp = searchParams.get("timestamp");
  const episodeRaw = searchParams.get("episode");

  let durationSeconds: number | null;
  try {
    buildCanonicalAudioUrl(soundOnUuid, timestamp);
    durationSeconds = parseDuration(searchParams.get("durationSeconds"));
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Invalid request" }, 400);
  }

  if (episodeRaw && !/^EP\d{1,5}$/i.test(episodeRaw)) {
    return json({ error: "episode must look like EP686" }, 400);
  }

  const { success } = await env.SUBMIT_LIMITER.limit({ key: "gooaye-stt-global-submit" });
  if (!success) return json({ error: "Submission rate limit reached. Try again shortly." }, 429);

  const existingJobId = await env.JOBS.get(`episode:${soundOnUuid}`);
  if (existingJobId) {
    const existing = await getStoredJob(env, existingJobId);
    if (existing && existing.status !== "error") {
      return json({
        reused: true,
        ...existing,
        statusUrl: `${origin}/v1/jobs/${existing.jobId}?token=${encodeURIComponent(token)}`,
      }, existing.status === "done" || existing.status === "partial" ? 200 : 202);
    }
  }

  const jobId = crypto.randomUUID();
  const now = new Date().toISOString();
  const job: SttJob = {
    jobId,
    episode: episodeRaw ? episodeRaw.toUpperCase() : null,
    soundOnUuid,
    timestamp,
    durationSeconds,
    createdAt: now,
  };

  const stored: StoredJob = {
    status: "queued",
    jobId,
    episode: job.episode,
    soundOnUuid,
    createdAt: now,
    updatedAt: now,
  };

  await saveStoredJob(env, stored);
  const ttl = positiveInt(env.RESULT_TTL_SECONDS, 7 * 24 * 60 * 60);
  await env.JOBS.put(`episode:${soundOnUuid}`, jobId, { expirationTtl: ttl });
  await env.STT_QUEUE.send(job);

  return json({
    reused: false,
    ...stored,
    statusUrl: `${origin}/v1/jobs/${jobId}?token=${encodeURIComponent(token)}`,
  }, 202);
}

async function getJob(request: Request, env: WorkerEnv): Promise<Response> {
  const url = new URL(request.url);
  if (!(await authorize(url, env))) return json({ error: "Unauthorized" }, 401);

  const jobId = url.pathname.split("/").pop() ?? "";
  if (!UUID_RE.test(jobId)) return json({ error: "Invalid job id" }, 400);
  const job = await getStoredJob(env, jobId);
  if (!job) return json({ error: "Job not found or expired" }, 404);
  return json(job, job.status === "queued" || job.status === "processing" ? 202 : 200);
}

async function consumeJob(message: Message<SttJob>, env: WorkerEnv): Promise<void> {
  const job = message.body;
  const current = await getStoredJob(env, job.jobId);
  const base: StoredJob = current ?? {
    status: "queued",
    jobId: job.jobId,
    episode: job.episode,
    soundOnUuid: job.soundOnUuid,
    createdAt: job.createdAt,
    updatedAt: job.createdAt,
  };

  await saveStoredJob(env, { ...base, status: "processing", updatedAt: new Date().toISOString() });

  try {
    const result = await transcribeAudio(job, env);
    const resultObject = result as Record<string, unknown>;
    const chunking = resultObject.chunking as Record<string, unknown> | undefined;
    const failedChunks = typeof chunking?.failedChunks === "number" ? chunking.failedChunks : 0;
    await saveStoredJob(env, {
      ...base,
      status: failedChunks > 0 ? "partial" : "done",
      updatedAt: new Date().toISOString(),
      result,
    });
    message.ack();
  } catch (error) {
    await saveStoredJob(env, {
      ...base,
      status: "error",
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown transcription failure",
    });
    message.ack();
  }
}

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "gooaye-stt-backend",
        model: MODEL,
        architecture: "worker -> queue -> workers-ai -> kv",
        freeTierDesigned: true,
      });
    }

    if (request.method === "GET" && url.pathname === "/v1/transcribe") {
      return submitJob(request, env);
    }

    if (request.method === "GET" && url.pathname.startsWith("/v1/jobs/")) {
      return getJob(request, env);
    }

    return json({
      error: "Not found",
      usage: "GET /v1/transcribe?token=<secret>&uuid=<soundon-uuid>&episode=EP686&durationSeconds=3001.939&timestamp=<optional>",
    }, 404);
  },

  async queue(batch: MessageBatch<SttJob>, env: WorkerEnv): Promise<void> {
    for (const message of batch.messages) await consumeJob(message, env);
  },
} satisfies ExportedHandler<WorkerEnv>;
