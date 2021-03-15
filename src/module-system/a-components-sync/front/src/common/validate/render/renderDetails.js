export default {
  methods: {
    renderDetails(c, context) {
      return this._renderComponent(c, context, {
        module: 'a-detail',
        name: 'renderDetails',
      });
    },
  },
};
