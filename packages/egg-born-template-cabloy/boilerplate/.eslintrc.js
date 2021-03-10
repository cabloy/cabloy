const path = require('path');

module.exports = {
  parser: 'vue-eslint-parser',
  extends: [
    'eslint-config-egg',
    'plugin:vue/essential',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    babelOptions: {
      configFile: path.join(__dirname, 'babel.config.js'),
    },
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
