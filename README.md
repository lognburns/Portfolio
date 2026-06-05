# Logan Burns — Portfolio

A static portfolio site ready for your design and photography work.

## Quick start

Open `index.html` in a browser, or run a local server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Adding your work

### 1. Add images

Drop project images into `assets/images/projects/`. Use JPG or PNG.

Optional hero and about photos:

- `assets/images/hero.jpg`
- `assets/images/about.jpg`

### 2. Update project data

Edit `data/projects.json`. Each project looks like this:

```json
{
  "id": "unique-slug",
  "title": "Project Name",
  "category": "Photography",
  "description": "Short description shown in the lightbox.",
  "image": "assets/images/projects/my-photo.jpg",
  "thumbnail": "assets/images/projects/my-photo.jpg",
  "featured": true,
  "year": "2025"
}
```

Categories are created automatically from your projects. Use consistent category names (e.g. `Photography`, `Branding`, `Graphics`) for filtering.

### 3. Customize copy

Update the text in `index.html` — hero, about section, and contact details.

## Deploy to GitHub Pages

The site auto-deploys from `main` via GitHub Actions.

**One-time setup:**

1. Go to [Settings → Pages](https://github.com/lognburns/Portfolio/settings/pages)
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Save

After the workflow runs, your site will be live at:

**https://lognburns.github.io/Portfolio/**

## Project structure

```
portfolio/
├── index.html          # Main page
├── css/styles.css      # Styles
├── js/main.js          # Gallery, filters, lightbox
├── data/projects.json  # Your project list
└── assets/images/      # Photos and graphics
```

## Send me content to add

You can share images and project details here in chat. Include:

- Image files (or descriptions of what to add)
- Project title, category, year, and description
- Any copy changes for the about or contact sections
