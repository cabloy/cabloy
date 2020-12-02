export default {
  methods: {
    renderTags(c, context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ... property,
          ebRender: {
            module: 'a-basefront',
            name: 'renderTags',
          },
        };
        context = {
          ...context,
          property,
        };
      }
      return this.renderComponent(c, context);
    },
  },
};
