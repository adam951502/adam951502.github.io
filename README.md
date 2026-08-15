# Personal portfolio

This personal website is adapted from the [@codewithsadee](https://github.com/codewithsadee/vcard-personal-portfolio) portfolio template.
The site is fully responsive and built with HTML, CSS, and JavaScript.

If you want to use this version, feel free to fork it.

## Managing portfolio projects

Project case studies are modular: each project has one JSON file under [`assets/data/projects/`](assets/data/projects/README.md). Edit that file to change its English or Traditional Chinese content, architecture, outcomes, links, image, or technology chips.

To add a project, copy `assets/data/projects/_template.json`, complete the new file, and list it in `assets/data/projects.json`.

## Structured-content validation

The portfolio treats JSON Schema as the structural contract for its content:

- `assets/data/projects/project-index.schema.json` validates the project manifest.
- `assets/data/projects/project.schema.json` validates each project case study.
- `assets/data/experience.schema.json` validates experience entries.
- `scripts/validate-schemas.mjs` runs schema validation and checks EN/ZH experience translation keys.
- `scripts/validate-projects.mjs` keeps semantic checks such as file existence, unique project IDs/images, manifest membership, and localized architecture requirements.

Install the validation dependency and run the complete validation suite with:

```bash
npm install
npm run validate
```

GitHub Actions runs the same validation automatically for pull requests and pushes to `main`.

## License

MIT
