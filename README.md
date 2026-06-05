# Logan Burns — Portfolio

Marketing strategist and creative director portfolio for BurnsMediaCo.

**Live site:** https://lognburns.github.io/Portfolio/

## Local preview

```bash
python3 -m http.server 8000
```

Open http://localhost:8000

## Project structure

```
Portfolio/
├── index.html
└── assets/images/
    ├── hero/           # Homepage hero photo
    ├── about/          # About section photo
    ├── case-studies/   # Project / case study images
    └── general/        # Other images
```

## Adding images

1. Save images to the matching folder under `assets/images/`
2. Reference them in `index.html` (hero already uses `assets/images/hero/logan-burns-hero.png`)
3. Commit and push

## Deploy

Pushes to `main` automatically deploy via GitHub Actions to GitHub Pages.
