module.exports = {
  parser: 'vue-eslint-parser',
  extends: [
    'eslint-config-egg',
    'plugin:vue/essential',
  ],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  plugins: [
  ],
  // add your custom rules here
  rules: {
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
  },
};
