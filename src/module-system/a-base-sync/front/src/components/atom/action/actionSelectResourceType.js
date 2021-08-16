export default {
  methods: {
    async _onActionSelectResourceType() {
      const { ctx, action } = this.$props;
      const resourceTypes = await ctx.$store.dispatch('a/base/getResourceTypes');
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectResourceTypeTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const key in resourceTypes) {
          const resourceType = resourceTypes[key];
          buttons.push({
            text: resourceType.titleLocale,
            onClick: () => {
              onButtonClick(key);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
  },
};
