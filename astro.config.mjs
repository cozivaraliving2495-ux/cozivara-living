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
      rollupOptions: {
        output: {
          manualChunks(id) {
            const moduleId = id.replaceAll('\\', '/');

            if (moduleId.endsWith('/node_modules/three/src/Three.js')) return 'three-entry';
            // ShaderChunk exports are leaf data modules; separating them keeps the
            // core below Vite's chunk warning threshold without splitting its cyclic shader helpers.
            if (moduleId.includes('/node_modules/three/src/renderers/shaders/ShaderChunk/')) return 'three-shader-chunks';
            // PMREMGenerator imports WebGLRenderTarget, and WebGLCubeUVMaps imports
            // PMREMGenerator back. Keep this connected renderer graph together.
            if (moduleId.includes('/node_modules/three/src/extras/PMREMGenerator.js')) return 'three-renderers';
            if (moduleId.includes('/node_modules/three/src/renderers/')) return 'three-renderers';
            if (moduleId.includes('/node_modules/three/src/')) return 'three-core';
            if (moduleId.includes('/node_modules/three/')) return 'three-vendor';
            if (moduleId.includes('/node_modules/three-stdlib/')) return 'three-controls';
            return undefined;
          },
        },
      },
    },
  },
});
