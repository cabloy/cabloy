export default {
  methods: {
    renderDetailsStat(context) {
      return this._renderComponent(context, {
        module: 'a-detail',
        name: 'renderDetailsStat',
      });
    },
  },
};
