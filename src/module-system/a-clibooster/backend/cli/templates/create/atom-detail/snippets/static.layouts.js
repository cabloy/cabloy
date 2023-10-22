const __snippet_declare = `// const layoutAtomList<%=argv.atomClassNameCapitalize%> = require('./layout/layoutAtomList<%=argv.atomClassNameCapitalize%>.js');\n`;
const __snippet_body = `// layoutAtomList<%=argv.atomClassNameCapitalize%>(app),`;

module.exports = {
  file: 'backend/src/meta/static/layouts.js',
  async transform({ cli, ast, argv, ctx }) {
    // code
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.before(code);
    code = await cli.template.renderContent({ content: __snippet_body });
    if (!ast.has(`const layouts = [$_$]`)) {
      ast.replace(`const layouts = []`, `const layouts = [\n${code}\n]`);
    } else {
      ast.replace(`const layouts = [$_$]`, `const layouts = [\n${code}\n $_$]`);
    }
    // ok
    return ast;
  },
};
