export default {
  methods: {
    renderLanguage(c, context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ... property,
          ebRender: {
            module: 'a-basefront',
            name: 'renderLanguage',
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
