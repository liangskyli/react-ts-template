/** @type {import("stylelint").Config} */
export default {
  root: true,
  // 继承某些已有的规则
  extends: [
    'stylelint-config-standard', // css 标准配置
    'stylelint-config-recess-order', // CSS 属性排序配置
  ],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.less'],
      extends: ['stylelint-config-standard-less'],
    },
    {
      files: ['**/*.scss'],
      extends: ['stylelint-config-standard-scss'],
    },
  ],
  rules: {},
  ignoreFiles: [
    '**/*.js',
    '**/*.jsx',
    '**/*.tsx',
    '**/*.ts',
    '**/*.json',
    '**/*.md',
    '**/*.yaml',
    '**/*.cjs',
  ],
};
