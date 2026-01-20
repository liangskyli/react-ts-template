import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#333' /** 主要文字 */,
        secondary: '#999' /** 次要文字 */,
        disabled: '#ddd' /** 禁用文字 */,
        red: {
          DEFAULT: '#e23' /** 主题色/强提示 */,
        },
        link: '#09f' /** 链接/信息 */,
      },
    },
  },
  plugins: [
    // 添加自定义插件，只生成 pb-safe-bottom 类
    plugin(function ({ addUtilities }) {
      const newUtilities = {
        '.pb-safe-area': {
          'padding-bottom': 'env(safe-area-inset-bottom)',
        },
        '.pt-safe-area': {
          'padding-top': 'env(safe-area-inset-top)',
        },
        '.pl-safe-area': {
          'padding-left': 'env(safe-area-inset-left)',
        },
        '.pr-safe-area': {
          'padding-right': 'env(safe-area-inset-right)',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
