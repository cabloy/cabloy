module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        useBuiltIns: false,
      },
    ],
  ],
  plugins: [ '@babel/plugin-syntax-dynamic-import' ],
  comments: false,
  env:
  {
    test:
    {
      presets: [ '@babel/preset-env' ],
      plugins: [ 'istanbul' ],
    },
  },
};
