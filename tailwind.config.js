/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    // require('daisyui')
  ],
  // daisyui: {
  //   themes: [
  //     'light',
  //     'dark',
  //     // 'bumblebee',
  //     // 'emerald',
  //     // 'corporate',
  //     // 'synthwave',
  //     // 'retro',
  //     // 'cyberpunk',
  //     // 'valentine',
  //     // 'halloween',
  //     // 'garden',
  //     // 'forest',
  //     // 'aqua',
  //     // 'lofi',
  //     // 'pastel',
  //     // 'fantasy',
  //     // 'wireframe',
  //     // 'black',
  //     // 'luxury',
  //     // 'dracula',
  //     // 'cmyk',
  //     'autumn',
  //     // 'business',
  //     // 'acid',
  //     // 'lemonade',
  //     // 'night',
  //     // 'coffee',
  //     // 'winter',
  //   ],
  // },
}
