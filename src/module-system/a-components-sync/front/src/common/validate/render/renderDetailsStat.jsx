export default {
  methods: {
    renderDetailsStat(c, context) {
      return this._renderComponent(c, context, {
        module: 'a-detail',
        name: 'renderDetailsStat',
      });
    },
  },
};
