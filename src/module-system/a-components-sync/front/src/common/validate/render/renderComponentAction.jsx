export default {
  methods: {
    renderComponentAction(context) {
      const { key, property } = context;
      const actionModule = property.ebRender && property.ebRender.actionModule;
      if (!actionModule) throw new Error(`actionModule not set for component-action: ${key}`);
      if (!this.__action_modules_get(actionModule)) {
        this.__action_modules_load(actionModule);
        return null;
      }
      return this.$meta.util.performActionSync({
        ctx: this,
        action: property.ebRender,
        item: { context },
      });
    },
  },
};
