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

## Deployment

For a private GitHub repository, connect this repository through **Cloudflare Workers Builds / Git integration** in the Cloudflare dashboard. Deploy-to-Cloudflare buttons require a public source repository.

In Cloudflare:

1. Workers & Pages → Create application.
2. Import a repository.
3. Authorize the Cloudflare GitHub app to access this private repository.
4. Select this repository.
5. Keep Worker name `gooaye-stt-backend`.
6. Add the `INVOCATION_SECRET` secret.
7. Save and deploy.

No `CLOUDFLARE_API_TOKEN` needs to be committed to this repository.

## Endpoints

### Health

```http
GET /health
```

### Submit transcription

```http
GET /v1/transcribe?token=<INVOCATION_SECRET>&uuid=<SOUNDON_UUID>&episode=EP686&durationSeconds=3001.939&timestamp=<OPTIONAL_SOUNDON_TIMESTAMP>
```

### Read job

```http
GET /v1/jobs/<jobId>?token=<INVOCATION_SECRET>
```

Possible statuses: `queued`, `processing`, `done`, `partial`, `error`.

A completed result contains transcript, segments, SoundOn source URLs, chunk success/failure counts, byte coverage percentage, and timestamp-quality metadata. GPT must run Coverage QA before treating an episode as complete.

## Transcription settings

Model: `@cf/openai/whisper-large-v3-turbo`

Defaults: Chinese (`zh`), VAD enabled, 1 MiB chunks, and a financial/Gooaye context prompt to improve proper nouns and English ticker/product retention.

Raw ASR is working data. The Gooaye Notion note should store structured paraphrase rather than reproducing the full copyrighted episode transcript.
