module.exports = {
  file: 'package.json',
  parseOptions: { language: 'json' },
  transform({ ast, context }) {
    return ast;
  },
};
