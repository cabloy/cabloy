export default {
  methods: {
    renderAtomClass(c, context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ...property,
          ebRender: {
            module: 'a-basefront',
            name: 'renderAtomClass',
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
