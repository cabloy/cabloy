module.exports = {
  parser: 'babel-eslint',
  extends: 'eslint-config-egg',
  parserOptions: {
    // ecmaVersion: 6, // 指定ECMAScript支持的版本，6为ES6
    sourceType: 'module',
  },
  // required to lint *.vue files
  // extends: 'vue',
  plugins: [
    'vuefix',
    //'html',
  ],
  // add your custom rules here
  rules: {
    'vuefix/vuefix': [ 2, { auto: true }],
  },
  globals: {
  },
};
