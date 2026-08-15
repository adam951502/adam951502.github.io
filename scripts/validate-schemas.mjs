import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataRoot = path.join(repoRoot, "assets", "data");
const projectsRoot = path.join(dataRoot, "projects");

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Unable to read JSON ${path.relative(repoRoot, filePath)}: ${error.message}`);
  }
}

function formatErrors(errors = []) {
  return errors
    .map((error) => {
      const location = error.instancePath || "/";
      return `  - ${location}: ${error.message}`;
    })
    .join("\n");
}

function assertValid(validate, data, label) {
  if (validate(data)) return;
  throw new Error(`${label} failed schema validation:\n${formatErrors(validate.errors)}`);
}

const ajv = new Ajv2020({ allErrors: true, strict: true });

const projectSchema = readJson(path.join(projectsRoot, "project.schema.json"));
const projectIndexSchema = readJson(path.join(projectsRoot, "project-index.schema.json"));
const experienceSchema = readJson(path.join(dataRoot, "experience.schema.json"));

const validateProject = ajv.compile(projectSchema);
const validateProjectIndex = ajv.compile(projectIndexSchema);
const validateExperience = ajv.compile(experienceSchema);

const manifestPath = path.join(dataRoot, "projects.json");
const manifest = readJson(manifestPath);
assertValid(validateProjectIndex, manifest, "assets/data/projects.json");

for (const relativeProjectPath of manifest.projectFiles) {
  const absoluteProjectPath = path.join(dataRoot, relativeProjectPath);
  const project = readJson(absoluteProjectPath);
  assertValid(validateProject, project, path.relative(repoRoot, absoluteProjectPath));
}

const experiencePath = path.join(dataRoot, "experience.json");
const experience = readJson(experiencePath);
assertValid(validateExperience, experience, "assets/data/experience.json");

const experienceIds = new Set();
for (const entry of experience) {
  if (experienceIds.has(entry.id)) {
    throw new Error(`Duplicate experience id: ${entry.id}`);
  }
  experienceIds.add(entry.id);
}

const translationFiles = ["en", "zh"].map((lang) => ({
  lang,
  values: readJson(path.join(repoRoot, "assets", "i18n", `${lang}.json`))
}));

for (const entry of experience) {
  const keys = [entry.datesKey, entry.titleKey, entry.pillKey, entry.descKey, entry.listKey];
  for (const { lang, values } of translationFiles) {
    for (const key of keys) {
      if (typeof values[key] !== "string" || values[key].trim() === "") {
        throw new Error(`Missing or empty ${lang} translation for experience key ${key} (${entry.id})`);
      }
    }
  }
}

console.log(
  `Schema validation passed: ${manifest.projectFiles.length} projects, ${experience.length} experience entries, EN/ZH experience keys.`
);
