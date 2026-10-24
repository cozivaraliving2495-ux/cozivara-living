/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cozi: {
          bg: '#FAF7F2',
          charcoal: '#2B2523',
          olive: '#5E6E53',
          'olive-dark': '#485540',
          'olive-light': '#EEF2EC',
          taupe: '#C4A484',
          sand: '#D4C5B9',
          cream: '#F4EFEA',
          border: '#EBE5DF',
          footer: '#222820',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      aspectRatio: {
        pin: '2 / 3',
        hero: '16 / 9',
        square: '1 / 1',
      },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(43, 37, 35, 0.05), 0 2px 6px -1px rgba(43, 37, 35, 0.03)',
        hover: '0 12px 30px -4px rgba(43, 37, 35, 0.09), 0 4px 10px -2px rgba(43, 37, 35, 0.05)',
      },
    },
  },
  plugins: [],
};
