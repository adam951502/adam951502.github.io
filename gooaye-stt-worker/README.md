# Gooaye Cloudflare STT Backend

Free-tier-first fallback transcription backend for the GPT Production Gooaye / 股癌 workflow.

This Worker **does not generate podcast notes**. It only provides ASR text and segment metadata when no reliable public transcript exists. ChatGPT/GPT remains responsible for episode identity, transcript coverage QA, proper-noun verification, note generation, and Notion updates.

## Architecture

```text
ChatGPT
  -> GET /v1/transcribe
  -> Cloudflare Worker
  -> Cloudflare Queue
  -> Workers AI: @cf/openai/whisper-large-v3-turbo
  -> Workers KV
  -> GET /v1/jobs/:jobId
  -> transcript + segments + coverage metadata
```

Why Queue + KV instead of a single long HTTP request:

- the submit request stays short;
- transcription continues in the Queue consumer;
- ChatGPT can poll the job result later;
- results and status survive between requests;
- only one job is kept per SoundOn episode UUID during the KV TTL window.

## Free-plan design

Cloudflare Workers AI currently gives the Free plan a daily Neurons allocation. `whisper-large-v3-turbo` is efficient enough for normal Gooaye usage, and KV/Queues usage for a few podcast episodes is tiny relative to their free daily quotas.

The application is deliberately limited to the official Gooaye SoundOn show UUID and only permits audio from:

- `rss.soundon.fm`
- `filesb.soundon.fm`

No arbitrary audio URL is accepted.

## Security

The API requires a low-privilege `INVOCATION_SECRET`.

This is **not** a Cloudflare API token. It only allows a caller to submit/read Gooaye STT jobs on this Worker.

The deployment flow will ask you for this secret because `.dev.vars.example` declares it. Use a long random value and do not commit the real value to Git.

Other controls:

- Gooaye-only SoundOn URL construction; callers supply only the SoundOn episode UUID.
- Redirect host validation on every hop.
- Maximum audio size: 80 MiB by default.
- Global submit rate limiter: 2 jobs/minute.
- KV dedupe by SoundOn UUID.
- Random UUID job IDs.
- Results expire after 7 days by default.
- Responses use `Cache-Control: no-store`.

## One-click deploy

Cloudflare Deploy buttons support a fully isolated Worker subdirectory and can automatically provision Workers AI, Queues, and KV from `wrangler.jsonc`.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/adam951502/adam951502.github.io/tree/feat/gooaye-cloudflare-stt-template/gooaye-stt-worker)

During setup:

1. Choose your Cloudflare account / Free plan.
2. Keep the generated Worker name or use `gooaye-stt-backend`.
3. For `INVOCATION_SECRET`, paste a long random string.
4. Allow Cloudflare to provision the AI binding, Queue, and KV namespace.
5. Select **Create and deploy**.
6. Copy the resulting `https://<worker>.<subdomain>.workers.dev` URL.

No `CLOUDFLARE_API_TOKEN` needs to be stored in this repository.

## Endpoints

### Health

```http
GET /health
```

### Submit transcription

```http
GET /v1/transcribe?token=<INVOCATION_SECRET>&uuid=<SOUNDON_UUID>&episode=EP686&durationSeconds=3001.939&timestamp=<OPTIONAL_SOUNDON_TIMESTAMP>
```

Example response while queued:

```json
{
  "status": "queued",
  "jobId": "...",
  "episode": "EP686",
  "soundOnUuid": "0e0b7654-dec7-479d-8edd-b5d51f76126d",
  "statusUrl": "https://.../v1/jobs/...?..."
}
```

### Read job

```http
GET /v1/jobs/<jobId>?token=<INVOCATION_SECRET>
```

Possible statuses:

- `queued`
- `processing`
- `done`
- `partial`
- `error`

A completed result contains:

- `transcript`
- `segments`
- canonical and final SoundOn URLs
- source audio bytes and official duration supplied by the caller
- chunk success/failure counts
- byte coverage percentage
- timestamp-quality metadata

If any chunk fails, status becomes `partial`. GPT must run Coverage QA before treating the episode as complete.

## Transcription settings

Model:

```text
@cf/openai/whisper-large-v3-turbo
```

Defaults:

- language: `zh`
- `vad_filter: true`
- `condition_on_previous_text: false`
- 1 MiB audio chunks
- financial/Gooaye context prompt to improve proper nouns and English ticker/product retention

Raw ASR is working data. The Gooaye Notion note should store structured paraphrase rather than reproducing the full copyrighted episode transcript.

## Local verification

```bash
npm install
npm run types
npm run check
```

Deploy manually if desired:

```bash
npx wrangler login
npm run deploy
```

## Relationship to the existing Gooaye repo

This backend is intentionally separate from the old GitHub Action/Ollama note-generation pipeline. It may be used only as an **STT capability** by GPT Production when the live Gooaye Skill reaches the Audio Pipeline fallback.
