const __snippet_body = "Demo: '演示',";

module.exports = {
  file: 'front/src/config/locale/zh-cn.js',
  async transform({ cli, ast, ctx }) {
    // code
    const code = await cli.template.renderContent({ content: __snippet_body });
    ast.replace('export default {$$$0}', `export default {${code} \n $$$0}`);
    // ok
    return ast;
  },
};
