export default {
  methods: {
    renderTags(context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ...property,
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
      return this.renderComponent(context);
    },
  },
};
