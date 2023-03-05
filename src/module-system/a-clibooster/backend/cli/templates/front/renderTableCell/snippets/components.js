const __snippet_declare = `import <%=argv.componentName%> from './components/render/<%=argv.componentName%>.jsx';`;
const __snippet_body = `<%=argv.componentName%>,`;

module.exports = {
  file: 'front/src/components.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(`export default {$$$0}`, `export default {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
