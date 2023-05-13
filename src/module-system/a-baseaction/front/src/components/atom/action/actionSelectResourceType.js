export default {
  methods: {
    async _onActionSelectResourceType() {
      const { ctx, action } = this.$props;
      const resourceTypes = await ctx.$store.dispatch('a/base/getResourceTypes');
      const buttons = [
        {
          text: ctx.$text('SelectResourceTypeTip'),
          label: true,
        },
      ];
      for (const key in resourceTypes) {
        const resourceType = resourceTypes[key];
        buttons.push({
          text: resourceType.titleLocale,
          data: key,
        });
      }
      // choose
      const params = {
        targetEl: action.targetEl,
        buttons,
      };
      const button = await ctx.$view.actions.choose(params);
      return button.data;
    },
  },
};
