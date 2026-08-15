import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(repoRoot, "assets", "data");
const manifest = JSON.parse(fs.readFileSync(path.join(dataRoot, "projects.json"), "utf8"));
const maxProjectImageBytes = 2 * 1024 * 1024;
const errors = [];
let totalBytes = 0;
let largest = { path: "", size: 0 };

for (const relativeProjectPath of manifest.projectFiles) {
  const projectPath = path.join(dataRoot, relativeProjectPath);
  const project = JSON.parse(fs.readFileSync(projectPath, "utf8"));
  const image = String(project.image || "");
  const absoluteImagePath = path.join(repoRoot, image);

  if (!image) {
    errors.push(`${project.id}: missing project image path`);
    continue;
  }
  if (!fs.existsSync(absoluteImagePath)) {
    errors.push(`${project.id}: project image does not exist: ${image}`);
    continue;
  }

  const size = fs.statSync(absoluteImagePath).size;
  totalBytes += size;
  if (size > largest.size) largest = { path: image, size };

  if (size > maxProjectImageBytes) {
    errors.push(`${project.id}: ${image} is ${(size / 1024 / 1024).toFixed(2)} MiB; project-card images must stay at or below 2 MiB`);
  }
  if (/\.gif$/i.test(image)) {
    errors.push(`${project.id}: GIF project thumbnails are not allowed; use optimized WebP/AVIF/static media: ${image}`);
  }
}

if (errors.length) {
  console.error("Project media validation failed:\n" + errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(
  `Project media budget passed: ${manifest.projectFiles.length} thumbnails, ${(totalBytes / 1024 / 1024).toFixed(2)} MiB total, largest ${(largest.size / 1024 / 1024).toFixed(2)} MiB (${largest.path}).`
);
