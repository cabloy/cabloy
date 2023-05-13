export default {
  methods: {
    async _onActionLayout() {
      const { ctx, action } = this.$props;
      // icon
      const iconDone = await ctx.$meta.util.combineIcon({ f7: '::done' });
      // config
      const layouts = ctx.layout_getLayouts();
      // buttons
      const layoutCurrent = ctx.layout.current;
      const buttons = [];
      for (const layout of layouts) {
        const icon = layoutCurrent === layout.name ? iconDone : ctx.$meta.util.emptyIcon;
        buttons.push({
          icon,
          text: layout.titleLocale,
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
