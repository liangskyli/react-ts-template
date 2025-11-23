/**  @type {import('lint-staged').Config} */
export default {
  '*.{ts,tsx,js,jsx,cjs,mjs}': 'eslint --fix',
  '*.{css,less}': 'stylelint --fix',
  '*.{ts,tsx,js,jsx,cjs,mjs,html,css,less,json}': 'prettier --write',
};
