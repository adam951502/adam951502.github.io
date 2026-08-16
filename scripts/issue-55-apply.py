from pathlib import Path


def replace_once(path, old, new, label):
    p = Path(path)
    text = p.read_text()
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected one match, found {count}')
    p.write_text(text.replace(old, new, 1))

runtime_old = '''function getTimelineRange(experienceData, translateFn) {
  const years = experienceData.flatMap((item) =>
    Array.from(String(translateFn(item.datesKey) || "").matchAll(/(?:19|20)\\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}'''
runtime_new = '''function getTimelineRange(experienceData, translateFn) {
  const dates = experienceData.map((item) => String(translateFn(item.datesKey) || ""));
  const years = dates.flatMap((value) =>
    Array.from(value.matchAll(/(?:19|20)\\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  const ongoingLabel = dates.some((value) => /目前/.test(value))
    ? "目前"
    : dates.some((value) => /\\bPresent\\b/i.test(value))
      ? "Present"
      : "";
  return `${Math.min(...years)}–${ongoingLabel || Math.max(...years)}`;
}'''
replace_once('assets/js/experience.js', runtime_old, runtime_new, 'runtime range formatter')

build_old = '''function getTimelineRange(items) {
  const years = items.flatMap((item) =>
    Array.from(String(translate(item.datesKey)).matchAll(/(?:19|20)\\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  return `${Math.min(...years)}–${Math.max(...years)}`;
}'''
build_new = '''function getTimelineRange(items) {
  const dates = items.map((item) => String(translate(item.datesKey)));
  const years = dates.flatMap((value) =>
    Array.from(value.matchAll(/(?:19|20)\\d{2}/g), (match) => Number.parseInt(match[0], 10))
  );
  if (!years.length) return "";
  const ongoingLabel = dates.some((value) => /\\bPresent\\b/i.test(value)) ? "Present" : "";
  return `${Math.min(...years)}–${ongoingLabel || Math.max(...years)}`;
}'''
replace_once('scripts/build-content.mjs', build_old, build_new, 'build range formatter')

replace_once(
    'scripts/smoke-runtime.mjs',
    'if (experienceSpan.range !== "2012–2025") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);',
    'if (experienceSpan.range !== "2012–Present") throw new Error(`Unexpected Experience career span: ${experienceSpan.range}`);',
    'English span smoke'
)

zh_anchor = '''  const translatedExperienceCount = await page.locator(".experience-span__count").textContent();
  if (translatedExperienceCount?.trim() !== "11 段經歷") throw new Error(`Unexpected translated Experience count: ${translatedExperienceCount}`);'''
zh_new = zh_anchor + '''
  const translatedExperienceRange = await page.locator(".experience-span__range").textContent();
  if (translatedExperienceRange?.trim() !== "2012–目前") throw new Error(`Unexpected translated Experience range: ${translatedExperienceRange}`);'''
replace_once('scripts/smoke-runtime.mjs', zh_anchor, zh_new, 'Chinese span smoke')

print('Issue #55 career span fix applied.')
