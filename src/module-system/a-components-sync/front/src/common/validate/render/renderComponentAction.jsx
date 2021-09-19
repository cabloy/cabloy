export default {
  methods: {
    renderComponentAction(context) {
      const { property } = context;
      return this.$meta.util.performActionSync({
        ctx: this,
        action: property.ebRender,
        item: { context },
      });
    },
  },
};
