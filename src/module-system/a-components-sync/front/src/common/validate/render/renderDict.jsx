export default {
  methods: {
    renderDict(context) {
      return this._renderComponent(context, {
        module: 'a-dict',
        name: 'renderDict',
      });
    },
  },
};
