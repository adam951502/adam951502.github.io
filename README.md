# Personal portfolio

This personal website is used the template from [@codewithsadee](https://github.com/codewithsadee/vcard-personal-portfolio), and adapting to my own version.
The vCard is a fully responsive personal portfolio website, responsive for all devices, built using HTML, CSS, and JavaScript.

If you want use this version, please make the fork! Cheers!

## Managing portfolio projects

Project case studies are modular: each project has one JSON file under [`assets/data/projects/`](assets/data/projects/README.md). Edit that file to change its English or Traditional Chinese content, architecture, outcomes, links, image, or technology chips.

To add a project, copy `assets/data/projects/_template.json`, complete the new file, and list it in `assets/data/projects.json`. Validate the complete project catalog with:

```bash
node scripts/validate-projects.mjs
```

## License
MIT
