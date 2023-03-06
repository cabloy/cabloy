const __snippet_declare = `import action from './components/action.js';`;
const __snippet_body = `action,`;

module.exports = {
  file: 'front/src/components.js',
  init: `export default {
  };`,
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    const exists = ast.find(code);
    if (exists.length === 0) {
      ast.before(code);
      code = await cli.template.renderContent({ content: __snippet_body });
      ast.replace(`export default {$$$0}`, `export default {${code} \n $$$0}`);
    }
    // ok
    return ast;
  },
};
