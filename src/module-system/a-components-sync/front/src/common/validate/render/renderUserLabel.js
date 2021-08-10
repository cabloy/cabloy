export default {
  methods: {
    renderUserLabel(c, context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ...property,
          ebRender: {
            module: 'a-basefront',
            name: 'renderUserLabel',
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
