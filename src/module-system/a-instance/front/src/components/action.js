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
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'preview') {
        return await this.onAction_preview();
      }
    },
    async onAction_preview() {
      const { ctx, action } = this.$props;
      // value
      const res = await ctx.$api.post('/a/instance/instance/getConfigsPreview');
      // taget
      let target = ctx.$meta.util.getProperty(action, 'navigateOptions.target');
      if (target === undefined) target = '_self';
      // navigate
      ctx.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target,
        context: {
          params: {
            value: res.data,
            title: ctx.$text('Preview'),
            readOnly: true,
          },
        },
      });
    },
  },
};
