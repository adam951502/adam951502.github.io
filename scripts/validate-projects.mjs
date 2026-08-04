import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(repositoryRoot, "assets/data/projects.json");
const projectDirectory = path.join(repositoryRoot, "assets/data/projects");
const errors = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${path.relative(repositoryRoot, filePath)}: ${error.message}`);
    return null;
  }
}

function requireString(value, field, file) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${file}: ${field} must be a non-empty string`);
}

function requireStringArray(value, field, file) {
  if (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== "string" || !item.trim())) {
    errors.push(`${file}: ${field} must be a non-empty array of strings`);
  }
}

function requireSortDate(value, field, file, required = false) {
  if (!required && value === undefined) return;
  const sortDatePattern = /^(9999-12|\d{4}-(0[1-9]|1[0-2])(?:-(0[1-9]|[12]\d|3[01]))?)$/;
  if (typeof value !== "string" || !sortDatePattern.test(value)) {
    errors.push(`${file}: ${field} must use YYYY-MM or YYYY-MM-DD (use 9999-12 for current work)`);
  }
}

function validateContent(content, locale, file, complete = false) {
  if (!content || typeof content !== "object" || Array.isArray(content)) {
    errors.push(`${file}: content.${locale} must be an object`);
    return;
  }

  const cardFields = ["title", "summary", "dates", "status"];
  const detailFields = ["role", "challenge"];
  const listFields = ["contribution", "technical", "outcomes"];

  for (const field of cardFields) {
    if (complete || field in content) requireString(content[field], `content.${locale}.${field}`, file);
  }
  for (const field of detailFields) {
    if (complete || field in content) requireString(content[field], `content.${locale}.${field}`, file);
  }
  for (const field of listFields) {
    if (complete || field in content) requireStringArray(content[field], `content.${locale}.${field}`, file);
  }

  if (complete || "architecture" in content) {
    if (!Array.isArray(content.architecture) || content.architecture.length !== 4) {
      errors.push(`${file}: content.${locale}.architecture must contain exactly four stages`);
    } else {
      content.architecture.forEach((stage, index) => {
        requireString(stage?.label, `content.${locale}.architecture[${index}].label`, file);
        requireString(stage?.detail, `content.${locale}.architecture[${index}].detail`, file);
      });
    }
  }
}

const manifest = readJson(manifestPath);
const projectFiles = manifest?.projectFiles;

if (manifest?.version !== 1) errors.push("assets/data/projects.json: version must be 1");
if (!Array.isArray(projectFiles) || !projectFiles.length) {
  errors.push("assets/data/projects.json: projectFiles must be a non-empty array");
}

const ids = new Set();
const projectImages = new Map();
const listedFiles = new Set(projectFiles || []);

for (const relativeFile of projectFiles || []) {
  const filePath = path.resolve(path.dirname(manifestPath), relativeFile);
  const file = path.relative(repositoryRoot, filePath);
  if (!filePath.startsWith(`${projectDirectory}${path.sep}`)) {
    errors.push(`${relativeFile}: project path must stay inside assets/data/projects`);
    continue;
  }
  if (!fs.existsSync(filePath)) {
    errors.push(`${relativeFile}: listed project file does not exist`);
    continue;
  }

  const project = readJson(filePath);
  if (!project) continue;

  requireString(project.id, "id", file);
  if (ids.has(project.id)) errors.push(`${file}: duplicate id ${project.id}`);
  ids.add(project.id);
  if (path.basename(relativeFile, ".json") !== project.id) {
    errors.push(`${file}: filename must match project id ${project.id}`);
  }
  if (!["genai", "data", "web", "mechanics"].includes(project.category)) {
    errors.push(`${file}: category must be genai, data, web, or mechanics`);
  }
  requireSortDate(project.sortStart, "sortStart", file, true);
  requireSortDate(project.sortEnd, "sortEnd", file);
  requireSortDate(project.sortUpdated, "sortUpdated", file);
  requireString(project.pillKey, "pillKey", file);
  requireString(project.image, "image", file);
  if (project.imageFit !== undefined && !["cover", "contain"].includes(project.imageFit)) {
    errors.push(`${file}: imageFit must be cover or contain`);
  }
  requireStringArray(project.chips, "chips", file);

  if (projectImages.has(project.image)) {
    errors.push(`${file}: representative image is also used by ${projectImages.get(project.image)}: ${project.image}`);
  } else {
    projectImages.set(project.image, file);
  }

  const imagePath = path.resolve(repositoryRoot, project.image || "");
  if (project.image && !fs.existsSync(imagePath)) errors.push(`${file}: image does not exist: ${project.image}`);
  if (project.architectureImage) {
    const architecturePath = path.resolve(repositoryRoot, project.architectureImage);
    if (!fs.existsSync(architecturePath)) errors.push(`${file}: architectureImage does not exist: ${project.architectureImage}`);
  }

  validateContent(project.content?.en, "en", file, true);
  validateContent(project.content?.zh, "zh", file, true);
}

for (const fileName of fs.readdirSync(projectDirectory)) {
  if (!fileName.endsWith(".json") || fileName.startsWith("_") || fileName.endsWith(".schema.json")) continue;
  const manifestEntry = `projects/${fileName}`;
  if (!listedFiles.has(manifestEntry)) errors.push(`${manifestEntry}: project file is not listed in assets/data/projects.json`);
}

if (errors.length) {
  console.error(`Project validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${ids.size} project files successfully.`);
