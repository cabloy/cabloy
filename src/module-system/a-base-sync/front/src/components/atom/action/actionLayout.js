export default {
  methods: {
    async _onActionLayout() {
      const { ctx, action } = this.$props;
      // config
      const configViewSize = ctx.$meta.util.getProperty(ctx.base.config, 'render.item.info.layout.viewSize');
      let layouts = configViewSize[ctx.container.mode][ctx.$view.size];
      if (!Array.isArray(layouts)) {
        layouts = [layouts];
      }
      // buttons
      const layoutCurrent = ctx.layout.current;
      const buttons = [];
      for (const layout of layouts) {
        const layoutConfig = ctx.$meta.util.getProperty(ctx.base.config, `render.item.layouts.${layout.name}`);
        if (!layoutConfig) continue;
        const iconName = layoutCurrent === layout.name ? 'done' : '';
        buttons.push({
          icon: `<i class="icon material-icons">${iconName}</i>`,
          text: ctx.$text(layoutConfig.title),
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
