import fs from "node:fs";

const indexPath = "index.html";
const html = fs.readFileSync(indexPath, "utf8");
const marker = '  <meta name="theme-color" content="#f5efe8">\n';
const seoMarker = '  <!-- SEO metadata -->\n';

if (html.includes(seoMarker)) {
  console.log("SEO metadata already present; no changes needed.");
  process.exit(0);
}

const occurrences = html.split(marker).length - 1;
if (occurrences !== 1) {
  throw new Error(`Expected exactly one theme-color marker, found ${occurrences}.`);
}

const seoBlock = `${marker}${seoMarker}  <meta name="description" content="Adam Tang is a GenAI engineer and data scientist building production AI, knowledge graph, data engineering, and software products.">\n  <link rel="canonical" href="https://www.adam-tang.com/">\n\n  <meta property="og:type" content="profile">\n  <meta property="og:title" content="Adam Tang — GenAI Engineer &amp; Data Scientist">\n  <meta property="og:description" content="Production AI, knowledge graph, data engineering, and software products by Adam Tang.">\n  <meta property="og:url" content="https://www.adam-tang.com/">\n  <meta property="og:image" content="https://www.adam-tang.com/assets/images/adam-avatar.png">\n  <meta property="og:image:alt" content="Portrait of Adam Tang">\n  <meta property="og:site_name" content="Adam Tang">\n\n  <meta name="twitter:card" content="summary">\n  <meta name="twitter:title" content="Adam Tang — GenAI Engineer &amp; Data Scientist">\n  <meta name="twitter:description" content="Production AI, knowledge graph, data engineering, and software products by Adam Tang.">\n  <meta name="twitter:image" content="https://www.adam-tang.com/assets/images/adam-avatar.png">\n  <meta name="twitter:image:alt" content="Portrait of Adam Tang">\n\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "ProfilePage",\n    "name": "Adam Tang — GenAI Engineer & Data Scientist",\n    "url": "https://www.adam-tang.com/",\n    "mainEntity": {\n      "@type": "Person",\n      "name": "Adam Tang",\n      "url": "https://www.adam-tang.com/",\n      "image": "https://www.adam-tang.com/assets/images/adam-avatar.png",\n      "jobTitle": "GenAI Engineer & Data Scientist",\n      "sameAs": [\n        "https://github.com/adam951502"\n      ],\n      "knowsLanguage": ["en", "zh-Hant", "de"]\n    }\n  }\n  </script>\n`;

fs.writeFileSync(indexPath, html.replace(marker, seoBlock));
console.log("Inserted static SEO metadata into index.html.");
