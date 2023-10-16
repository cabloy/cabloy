module.exports = {
  file: 'package.json',
  parseOptions: { language: 'json' },
  async transform({ ast, argv }) {
    argv.fileVersion = ++ast.eggBornModule.fileVersion;
    return ast;
  },
};
