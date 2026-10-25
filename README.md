# Cozivara Living

Cozivara Living is an Astro site for home decor articles and a browser-based 3D room planner. The visual system uses a warm neutral palette, serif headings, and sans-serif body text.

## Pages and content

- `/` — home page
- `/blog` — article archive
- `/blog/[slug]` — article pages generated from `src/data/posts.ts`
- `/category/[category]` — category archives generated from `src/data/categories.ts`
- `/design-my-room` — interactive room planner
- `/about`, `/contact`, `/privacy-policy`, and `/terms` — information and policy pages

The planner is built with React, Three.js, and React Three Fiber. It stores saved room designs in the browser's local storage. Contact opens a prefilled email draft in the visitor's mail app; newsletter signup is currently unavailable. Shopping buttons lead to retailer search pages and do not show prices or claim affiliate status.

## Local development

Requires Node.js and npm. From the project folder:

```powershell
npm install
npm run dev
```

Astro prints the local URL, usually `http://localhost:4321`. Use `Ctrl+C` to stop the server.

## Available scripts

```powershell
npm run dev      # Start Astro's development server
npm run build    # Build the static site into dist/
npm run preview  # Serve the production build locally
```

The project currently has no dedicated lint or test script. Deployment configuration should be added for the hosting provider selected by the site owner; no Netlify configuration is present in this repository.

## Project map

```text
src/
  components/          Shared Astro components and room-designer React components
  data/                Article and category content
  layouts/             Base site and article layouts
  pages/               Astro file-based routes
  styles/global.css    Global design tokens and site styles
public/                Static assets served from the site root
astro.config.mjs       Astro integrations and site configuration
package.json           Dependencies and npm scripts
```
