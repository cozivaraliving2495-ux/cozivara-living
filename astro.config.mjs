import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const threeSourceEntry = fileURLToPath(new URL('./node_modules/three/src/Three.js', import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: 'https://cozivaraliving.com',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      filter: (page) => !page.endsWith('/contact-success'),
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
