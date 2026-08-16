from pathlib import Path

path = Path('scripts/smoke-runtime.mjs')
text = path.read_text()
old = 'if (experienceSpan.range !== "2012–2026") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);'
new = 'if (experienceSpan.range !== "2012–2025") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);'
if old not in text:
    raise SystemExit('Expected 2012–2026 career span assertion was not found')
path.write_text(text.replace(old, new, 1))
