import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resumeRoot = path.join(repoRoot, "assets", "resume");

const allowedResumeFiles = new Set([
  "CV_Adam_EU_20260730.docx",
  "CV_Adam_EU_20260730.pdf",
  "CV_Adam_US_20260730.docx",
  "CV_Adam_US_20260730.pdf"
]);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

const errors = [];
const resumeFiles = fs.existsSync(resumeRoot) ? fs.readdirSync(resumeRoot).sort() : [];

for (const file of resumeFiles) {
  if (!allowedResumeFiles.has(file)) {
    errors.push(`Unexpected public resume artifact: assets/resume/${file}`);
  }
}

for (const expectedFile of allowedResumeFiles) {
  if (!resumeFiles.includes(expectedFile)) {
    errors.push(`Missing current resume artifact: assets/resume/${expectedFile}`);
  }
}

const forbiddenPaths = [
  "assets/i18n/de.json",
  "assets/images/web_icon.ico"
];

for (const relativePath of forbiddenPaths) {
  if (fs.existsSync(path.join(repoRoot, relativePath))) {
    errors.push(`Stale public artifact must not be committed: ${relativePath}`);
  }
}

for (const absolutePath of walk(path.join(repoRoot, "assets"))) {
  if (absolutePath.toLowerCase().endsWith(".mhtml")) {
    errors.push(`Archived webpage must not be published: ${path.relative(repoRoot, absolutePath)}`);
  }
}

if (errors.length) {
  console.error("Repository hygiene validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Repository hygiene passed: ${resumeFiles.length} current resume source/output files and no stale MHTML/DE/duplicate favicon artifacts.`);
