module.exports = {
  file: 'package.json',
  transform({ ast, context }) {
    return ast;
  },
};
