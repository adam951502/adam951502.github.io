import fs from "node:fs";

const indexHtml = fs.readFileSync("index.html", "utf8");
const robots = fs.readFileSync("robots.txt", "utf8");
const sitemap = fs.readFileSync("sitemap.xml", "utf8");
const canonicalUrl = "https://adam951502.github.io/";
const socialImage = "https://adam951502.github.io/assets/images/adam-avatar.png";

const requiredIndexFragments = [
  '<meta name="description" content=',
  `<link rel="canonical" href="${canonicalUrl}">`,
  '<meta property="og:type" content="profile">',
  '<meta property="og:title" content=',
  `<meta property="og:url" content="${canonicalUrl}">`,
  `<meta property="og:image" content="${socialImage}">`,
  '<meta name="twitter:card" content="summary">',
  '<meta name="twitter:title" content=',
  `<meta name="twitter:image" content="${socialImage}">`,
  '<script type="application/ld+json">'
];

const errors = [];
for (const fragment of requiredIndexFragments) {
  if (!indexHtml.includes(fragment)) errors.push(`Missing index SEO fragment: ${fragment}`);
}

const jsonLdMatch = indexHtml.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
if (!jsonLdMatch) {
  errors.push("Missing JSON-LD block");
} else {
  try {
    const jsonLd = JSON.parse(jsonLdMatch[1]);
    if (jsonLd["@type"] !== "ProfilePage") errors.push("JSON-LD root @type must be ProfilePage");
    if (jsonLd.url !== canonicalUrl) errors.push("JSON-LD ProfilePage URL must match canonical URL");
    if (jsonLd.mainEntity?.["@type"] !== "Person") errors.push("JSON-LD mainEntity must be Person");
    if (jsonLd.mainEntity?.name !== "Adam Tang") errors.push("JSON-LD Person name must be Adam Tang");
  } catch (error) {
    errors.push(`Invalid JSON-LD: ${error.message}`);
  }
}

if (!robots.includes(`Sitemap: ${canonicalUrl}sitemap.xml`)) {
  errors.push("robots.txt must reference the canonical sitemap URL");
}
if (!sitemap.includes(`<loc>${canonicalUrl}</loc>`)) {
  errors.push("sitemap.xml must contain the canonical portfolio URL");
}
if (!fs.existsSync("assets/images/adam-avatar.png")) {
  errors.push("Social preview image asset is missing");
}

if (errors.length) {
  console.error("SEO validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log("SEO validation passed: canonical, social metadata, JSON-LD, robots, sitemap, and preview image are present.");
