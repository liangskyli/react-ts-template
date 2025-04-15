/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#333' /** 主要文字 */,
        secondary: '#999' /** 次要文字 */,
        disabled: '#ddd' /** 禁用文字 */,
        white: '#fff',
        red: {
          DEFAULT: '#e23' /** 主题色/强提示 */,
        },
        link: '#09f' /** 链接/信息 */,
      },
    },
  },
  plugins: [],
};
