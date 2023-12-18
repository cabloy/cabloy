const __snippet_staticApps = 'const staticApps = require(\'./meta/static/apps.js\');';
const __snippet_staticsApp = `
'a-app.app': {
  items: staticApps,
},`;

module.exports = {
  file: 'backend/src/meta.js',
  async transform({ cli, ast, argv, ctx }) {
    // staticApps
    if (!ast.has(__snippet_staticApps)) {
      // insert
      let code = await cli.template.renderContent({ content: __snippet_staticApps });
      ast.find('const meta = {$$$0}').before(code);
      // apps
      code = await cli.template.renderContent({ content: __snippet_staticsApp });
      ast.replace(
        'const meta = { base: { statics: {$$$0},$$$1 },$$$2 }',
        `const meta = { base: { statics: { ${code} \n $$$0},$$$1 },$$$2 }`
      );
    }
    // ok
    return ast;
  },
};
