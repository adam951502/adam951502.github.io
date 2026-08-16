from pathlib import Path

path = Path("scripts/smoke-runtime.mjs")
text = path.read_text()
old_return = '''    return {\n      valid: true,\n      axisX,\n      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,\n      steps: steps.map((step, index) => {'''
new_return = '''    return {\n      valid: true,\n      axisX,\n      viewportWidth: window.innerWidth,\n      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,\n      steps: steps.map((step, index) => {'''
if text.count(old_return) != 1:
    raise SystemExit(f"Expected mobile Experience return block once, found {text.count(old_return)}")
text = text.replace(old_return, new_return, 1)
old_assert = '    if (step.cardRight > window.innerWidth + 1) {'
new_assert = '    if (step.cardRight > mobileExperienceTimeline.viewportWidth + 1) {'
if text.count(old_assert) != 1:
    raise SystemExit(f"Expected viewport assertion once, found {text.count(old_assert)}")
text = text.replace(old_assert, new_assert, 1)
path.write_text(text)
