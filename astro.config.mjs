import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const threeSourceEntry = fileURLToPath(new URL('./node_modules/three/src/Three.js', import.meta.url));
// Use the live Netlify hostname until a custom domain is configured. Set
// PUBLIC_SITE_URL in Netlify when the site's primary domain changes.
const siteUrl = (process.env.PUBLIC_SITE_URL?.trim() || 'https://cozivaraliving.netlify.app').replace(/\/+$/, '');

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !new URL(page).pathname.replace(/\/+$/, '').endsWith('/contact-success'),
    }),
    react(),
  ],
  vite: {
    resolve: {
      alias: [{ find: /^three$/, replacement: threeSourceEntry }],
    },
    build: {
      // The planner's Three.js runtime is dynamically loaded only on its route;
      // 179 KB gzip is acceptable, so warn only if it grows beyond 700 KB raw.
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const moduleId = id.replaceAll('\\', '/');

            if (moduleId.endsWith('/node_modules/three/src/Three.js')) return 'three-entry';
            // Keep Three's cyclic core/renderer module graph in one lazy-loaded chunk.
            // Splitting renderers from core creates a production TDZ error in browsers.
            if (moduleId.includes('/node_modules/three/src/')) return 'three-runtime';
            if (moduleId.includes('/node_modules/three/')) return 'three-vendor';
            if (moduleId.includes('/node_modules/three-stdlib/')) return 'three-controls';
            return undefined;
          },
        },
      },
    },
  },
});
