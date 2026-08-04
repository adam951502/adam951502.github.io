# Project content guide

Each portfolio project lives in its own JSON file in this folder. This keeps project content independent from the rendering code and from other projects.

## Edit an existing project

1. Open the matching file, for example `stock-toolkit.json`.
2. Edit metadata such as `image`, `chips`, or `links` near the top.
3. Edit English content inside `content.en`.
4. Edit Traditional Chinese content inside `content.zh`. Both languages require a complete case study.
5. Run `node scripts/validate-projects.mjs` from the repository root.

The website orders projects automatically using `sortEnd`, then `sortUpdated`, then `sortStart`. You do not need to rearrange the manifest just to change display order.

## Add a project

1. Copy `_template.json` to a lowercase kebab-case filename such as `my-new-project.json`.
2. Give the project the same unique kebab-case `id`.
3. Complete both `content.en` and `content.zh`.
4. Add the representative image under `assets/images/` and update `image`.
5. Add `"projects/my-new-project.json"` to `assets/data/projects.json`.
6. Run the validator and preview the site.

## Content structure

- `category`: one of `genai`, `data`, `web`, or `mechanics`.
- `sortStart`: first active month in `YYYY-MM` format.
- `sortEnd`: final active month, or `9999-12` for current work.
- `sortUpdated`: latest meaningful update in `YYYY-MM` or `YYYY-MM-DD` format; used to order concurrent projects.
- `pillKey`: localized category label from the shared interface translations.
- `image`: representative project image shown on the collapsed card.
- `architectureImage`: optional detailed diagram shown above the architecture steps.
- `chips`: short, scannable technologies or methods.
- `links`: optional public repository, demo, paper, or website links.
- `content.en`: required complete English case study.
- `content.zh`: required complete Traditional Chinese case study.

The renderer still falls back to English at runtime as a safety measure, but the validator rejects missing Traditional Chinese fields before publication.

The JSON Schema files provide editor hints and catch structural mistakes. Project content is rendered as plain text; HTML is not needed inside project files.
