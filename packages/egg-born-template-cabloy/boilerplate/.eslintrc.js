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
    'no-unused-vars': ['error', {
      varsIgnorePattern: 'app|mockUrl|mockInfo|assert',
    }],
    'array-bracket-spacing': ['error', 'never'],
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
    'no-empty-function': ['error', {
      allow: [
        'functions', 'arrowFunctions', 'generatorFunctions',
        'methods', 'generatorMethods', 'getters', 'setters',
        'constructors', 'asyncFunctions', 'asyncMethods',
      ],
    }],
  },
  env: {
    browser: true,
    node: true,
  },
  globals: {},
};
