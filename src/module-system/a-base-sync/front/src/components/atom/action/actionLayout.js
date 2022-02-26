export default {
  methods: {
    async _onActionLayout() {
      const { ctx, action } = this.$props;
      // icon
      const iconDone = await ctx.$meta.util.combineIcon({ f7: '::done' });
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
        const icon = layoutCurrent === layout.name ? iconDone : '<i class="icon"></i>';
        buttons.push({
          icon,
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
