module.exports = {
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': [
      'error',
      {
        code: 120,
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
        allow: [
          'functions',
          'arrowFunctions',
          'generatorFunctions',
          'methods',
          'generatorMethods',
          'getters',
          'setters',
          'constructors',
          'asyncFunctions',
          'asyncMethods',
        ],
      },
    ],
    'no-constant-condition': [
      'error',
      {
        checkLoops: false,
      },
    ],
    'one-var-declaration-per-line': [0],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'generator-star-spacing': [0],
    'newline-per-chained-call': [0],
    'vue/multi-word-component-names': [0],
  },
};
