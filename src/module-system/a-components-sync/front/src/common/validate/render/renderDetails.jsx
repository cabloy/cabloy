export default {
  methods: {
    renderDetails(context) {
      const { parcel } = context;
      const atomIdMain = parcel.data.atomId;
      if (atomIdMain === 0) return null;
      return this._renderComponent(context, {
        module: 'a-detail',
        name: 'renderDetails',
      });
    },
  },
};
