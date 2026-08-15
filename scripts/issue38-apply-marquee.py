from pathlib import Path
import json
import re

index_path = Path("index.html")
index = index_path.read_text()
if "affiliation-marquee__track" in index:
    raise SystemExit("Affiliation marquee already present")

pattern = re.compile(
    r'(?P<indent>[ \t]*)<div class="signature-list">\s*'
    r'<span>Fraunhofer EMI</span>\s*'
    r'<span>Aurore Collection</span>\s*'
    r'<span>University of Freiburg</span>\s*'
    r'<span>NTUST</span>\s*'
    r'<span>Chang Gung University</span>\s*'
    r'</div>'
)
match = pattern.search(index)
if not match:
    raise SystemExit("Static Selected contexts block not found")

i = match.group("indent")
c, g, gg, d = i + "  ", i + "    ", i + "      ", i + "        "
new_contexts = f'''{i}<div class="affiliation-marquee" aria-label="Professional and research contexts">
{c}<div class="affiliation-marquee__track">
{g}<div class="affiliation-marquee__group" role="list">
{gg}<div class="affiliation-item" role="listitem" title="Fraunhofer Institute for High-Speed Dynamics, Ernst-Mach-Institut">
{d}<img src="assets/images/emi-color.svg" alt="Fraunhofer EMI" loading="lazy">
{gg}</div>
{gg}<div class="affiliation-item affiliation-item--relationship" role="listitem" title="cytena Bioprocess Solutions, now Leadgene Biosolutions">
{d}<img src="assets/images/cropped-Logotype_RGB_Cytena_Color.webp" alt="cytena Bioprocess Solutions" loading="lazy">
{d}<span class="affiliation-note">now Leadgene Biosolutions</span>
{gg}</div>
{gg}<div class="affiliation-item" role="listitem" title="National Taiwan University of Science and Technology (Taiwan Tech)">
{d}<img src="assets/images/NTUST_logo.png" alt="Taiwan Tech" loading="lazy">
{gg}</div>
{gg}<div class="affiliation-item" role="listitem" title="Institute for Sustainable Systems Engineering (INATECH)">
{d}<img src="assets/images/inatech_long.png" alt="INATECH" loading="lazy">
{gg}</div>
{gg}<div class="affiliation-item" role="listitem" title="HERAKLION research project">
{d}<span class="affiliation-wordmark" aria-label="HERAKLION">HERAKLION</span>
{gg}</div>
{gg}<div class="affiliation-item" role="listitem" title="Aurore Collection">
{d}<img src="assets/images/aurore_co.png" alt="Aurore Collection" loading="lazy">
{gg}</div>
{g}</div>
{g}<div class="affiliation-marquee__group" aria-hidden="true">
{gg}<div class="affiliation-item"><img src="assets/images/emi-color.svg" alt="" loading="lazy"></div>
{gg}<div class="affiliation-item affiliation-item--relationship"><img src="assets/images/cropped-Logotype_RGB_Cytena_Color.webp" alt="" loading="lazy"><span class="affiliation-note">now Leadgene Biosolutions</span></div>
{gg}<div class="affiliation-item"><img src="assets/images/NTUST_logo.png" alt="" loading="lazy"></div>
{gg}<div class="affiliation-item"><img src="assets/images/inatech_long.png" alt="" loading="lazy"></div>
{gg}<div class="affiliation-item"><span class="affiliation-wordmark">HERAKLION</span></div>
{gg}<div class="affiliation-item"><img src="assets/images/aurore_co.png" alt="" loading="lazy"></div>
{g}</div>
{c}</div>
{i}</div>'''

index = pattern.sub(lambda _: new_contexts, index, count=1)
index = index.replace('aria-label="Selected contexts"', 'aria-label="Experience across research and industry"', 1)
index = index.replace('>Selected contexts</p>', '>Experience across research &amp; industry</p>', 1)
index = index.replace(
    '>Blending research rigor, production delivery, and business execution.</p>',
    '>Organizations and research ecosystems from my professional journey.</p>',
    1,
)
index_path.write_text(index)

for filename, title, body in [
    (
        "assets/i18n/en.json",
        "Experience across research & industry",
        "Organizations and research ecosystems from my professional journey.",
    ),
    (
        "assets/i18n/zh.json",
        "跨研究與產業經歷",
        "來自職涯、研究與產品實作歷程中的機構與產業生態系。",
    ),
]:
    path = Path(filename)
    data = json.loads(path.read_text())
    data["hero.aside.title"] = title
    data["hero.aside.body"] = body
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

css_path = Path("assets/css/style.css")
css = css_path.read_text()
marker = "/* Issue #38: continuous affiliation marquee */"
if marker in css:
    raise SystemExit("Affiliation marquee CSS already present")

css += r'''

/* Issue #38: continuous affiliation marquee */
.affiliation-marquee {
  position: relative;
  min-width: 0;
  overflow: hidden;
  padding: 10px 0;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}

.affiliation-marquee__track {
  display: flex;
  width: max-content;
  will-change: transform;
  animation: affiliation-marquee-right 36s linear infinite;
}

.affiliation-marquee:hover .affiliation-marquee__track {
  animation-play-state: paused;
}

.affiliation-marquee__group {
  display: flex;
  align-items: center;
  gap: clamp(34px, 4vw, 62px);
  padding-right: clamp(34px, 4vw, 62px);
}

.affiliation-item {
  min-width: 154px;
  height: 72px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 10px;
  opacity: 0.64;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.affiliation-item img {
  width: auto;
  max-width: 178px;
  max-height: 38px;
  object-fit: contain;
  filter: grayscale(1) saturate(0.25);
  transition: filter 0.24s ease, opacity 0.24s ease;
}

.affiliation-item--relationship {
  min-width: 250px;
}

.affiliation-note {
  max-width: 104px;
  color: var(--muted-soft);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  line-height: 1.25;
  letter-spacing: 0.04em;
}

.affiliation-wordmark {
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.18em;
}

.affiliation-item:hover {
  opacity: 1;
  transform: translateY(-1px);
}

.affiliation-item:hover img {
  filter: grayscale(0) saturate(1);
}

:root[data-theme="dark"] .affiliation-item img {
  filter: grayscale(1) brightness(1.5) contrast(0.9) saturate(0.2);
}

:root[data-theme="dark"] .affiliation-item:hover img {
  filter: grayscale(0) brightness(1.08) saturate(1);
}

@keyframes affiliation-marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

@media (max-width: 640px) {
  .affiliation-marquee {
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
    mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  }

  .affiliation-marquee__track {
    animation-duration: 32s;
  }

  .affiliation-marquee__group {
    gap: 28px;
    padding-right: 28px;
  }

  .affiliation-item {
    min-width: 136px;
    height: 62px;
  }

  .affiliation-item img {
    max-width: 150px;
    max-height: 32px;
  }

  .affiliation-item--relationship {
    min-width: 224px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .affiliation-marquee {
    overflow-x: auto;
    -webkit-mask-image: none;
    mask-image: none;
  }

  .affiliation-marquee__track {
    width: 100%;
    animation: none;
    transform: none;
  }

  .affiliation-marquee__group {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    padding-right: 0;
  }

  .affiliation-marquee__group[aria-hidden="true"] {
    display: none;
  }
}
'''
css_path.write_text(css)
