export default {
  methods: {
    async _onActionBulkLayout() {
      const { ctx, action } = this.$props;
      // config
      const configViewSize = ctx.$meta.util.getProperty(ctx.base.config, 'render.list.info.layout.viewSize');
      let layouts = configViewSize[ctx.$view.size];
      if (!Array.isArray(layouts)) {
        layouts = [layouts];
      }
      // buttons
      const buttons = [];
      for (const layout of layouts) {
        buttons.push({
          text: ctx.$text(layout.title),
          data: layout,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: action.targetEl,
        buttons,
      };
      const button = await ctx.$view.actions.choose(params);
      console.log(button.data);
    },
  },
};
