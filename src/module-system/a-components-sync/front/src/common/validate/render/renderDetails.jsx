export default {
  methods: {
    renderDetails(context) {
      return this._renderComponent(
        context,
        {
          module: 'a-detail',
          name: 'renderDetails',
        },
        'eb-details-container'
      );
    },
  },
};
