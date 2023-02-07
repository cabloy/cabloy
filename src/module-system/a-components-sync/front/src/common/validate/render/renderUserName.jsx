export default {
  methods: {
    renderUserName(context) {
      let { property } = context;
      if (!property.ebRender) {
        property = {
          ...property,
          ebRender: {
            module: 'a-baserender',
            name: 'renderUserName',
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
