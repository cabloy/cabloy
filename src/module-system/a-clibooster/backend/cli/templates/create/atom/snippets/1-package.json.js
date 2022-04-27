module.exports = {
  file: 'package.json',
  parseOptions: { language: 'json' },
  transform({ ast, argv }) {
    return ast;
  },
};
