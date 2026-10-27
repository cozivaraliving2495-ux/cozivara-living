# Cozivara Living

Cozivara Living is an Astro site for home decor articles and a browser-based 3D room planner. The visual system uses a warm neutral palette, serif headings, and sans-serif body text.

## Pages and content

- `/` — home page
- `/blog` — article archive
- `/blog/[slug]` — article pages generated from `src/data/posts.ts`
- `/category/[category]` — category archives generated from `src/data/categories.ts`
- `/design-my-room` — interactive room planner
- `/about`, `/contact`, `/privacy-policy`, and `/terms` — information and policy pages

The planner is built with React, Three.js, and React Three Fiber. Its 3D entry is code-split from the small Astro island and its room metrics use the site's Playfair Display numerals. It stores saved room designs in the browser's local storage. On Netlify, the contact form submits to Netlify Forms; local development opens an email draft. Newsletter signup is currently unavailable. Google Analytics 4 can be enabled with `PUBLIC_GA_MEASUREMENT_ID`; the tag loads only after a visitor opts in. Shopping buttons lead to retailer search pages and do not show prices or claim affiliate status.

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

The project currently has no dedicated lint or test script. Netlify deployment is configured in `netlify.toml` with `npm run build` and `dist` as the publish directory. Review `docs/netlify-launch-checklist.md` for account setup, environment variables, forms, SEO verification, Pinterest ownership, and AdSense steps.

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
