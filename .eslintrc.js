module.exports = {
  extends: ['plugin:vue/vue3-recommended'],
  env: {
    browser: true,
    es2022: true,
    node: true,
    commonjs: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {},
};
