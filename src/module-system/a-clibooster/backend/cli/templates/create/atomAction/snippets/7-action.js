const __snippet_declare = `import Action<%=argv.actionNameCapitalize%> from './action/action<%=argv.actionNameCapitalize%>.js';`;
const __snippet_mixin = `Action<%=argv.actionNameCapitalize%>,`;
const __snippet_method = `if (this.action.name === '<%=argv.actionName%>') {
  return await this._onAction<%=argv.actionNameCapitalize%>();
}`;

module.exports = {
  file: 'front/src/components/action1.js',
  init: `
  import Vue from 'vue';
  const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;
  
  export default {
    meta: {
      global: false,
    },
    mixins: [
      ebActionBase, //
    ],
    methods: {
      async onAction() {
      },
    },
  };
  `,
  async transform({ cli, ast, argv, ctx }) {
    // add declare
    let code = await cli.template.renderContent({ content: __snippet_declare });
    ast.find("import Vue from 'vue';").after(code);
    // add mixin
    code = await cli.template.renderContent({ content: __snippet_mixin });
    ast.replace(`mixins: [$_$]`, `mixins: [$_$, \n ${code}]`);
    // add method
    code = await cli.template.renderContent({ content: __snippet_method });
    ast.replace(`async onAction() {$$$0}`, `async onAction() {$$$0 \n ${code} }`);
    // ok
    return ast;
  },
};
