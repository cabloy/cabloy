const __snippet_declare = `const atom<%=argv.atomClassNameCapitalize%> = require('./bean/atom.<%=argv.atomClassName%>.js');\n`;
const __snippet_body = `// atom
'atom.<%=argv.atomClassName%>': {
  mode: 'ctx',
  bean: atom<%=argv.atomClassNameCapitalize%>,
},`;

module.exports = {
  file: 'backend/src/beans.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace(`const beans = {$$$0}`, `const beans = {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
