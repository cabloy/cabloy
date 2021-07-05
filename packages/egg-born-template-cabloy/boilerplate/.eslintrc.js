const path = require('path');

module.exports = {
  parser: 'vue-eslint-parser',
  extends: ['eslint-config-egg', 'plugin:vue/essential'],
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
    'max-len': [
      'error',
      {
        code: 200,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-undef': [
      'error',
      {
        typeof: false,
      },
    ],
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'app|mockUrl|mockInfo|assert|schemas|load|loadjsx',
        argsIgnorePattern: 'app|ctx|user|state|reject|options',
      },
    ],
    'array-bracket-spacing': ['error', 'never'],
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-empty-function': [
      'error',
      {
        allow: ['functions', 'arrowFunctions', 'generatorFunctions', 'methods', 'generatorMethods', 'getters', 'setters', 'constructors', 'asyncFunctions', 'asyncMethods'],
      },
    ],
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {
    $: true,
    util: true,
    env: true,
    App: true,
    getApp: true,
    Page: true,
    wx: true,
  },
};
