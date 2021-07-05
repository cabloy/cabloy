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
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': [
      0,
      {
        vars: 'local',
        args: 'none',
      },
    ],
    'array-bracket-spacing': ['error', 'never'],
    'no-empty': ['error', 'never'],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {},
};
