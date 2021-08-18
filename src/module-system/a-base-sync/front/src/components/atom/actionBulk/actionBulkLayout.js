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
      const layoutCurrent = ctx.layout.current;
      const buttons = [];
      for (const layout of layouts) {
        const iconName = layoutCurrent === layout.name ? 'done' : '';
        buttons.push({
          icon: `<i class="icon material-icons">${iconName}</i>`,
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
      // switch layout
      await ctx.layout_switchLayout(button.data.name);
    },
  },
};
