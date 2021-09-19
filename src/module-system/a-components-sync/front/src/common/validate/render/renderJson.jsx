export default {
  methods: {
    renderJson(context) {
      return this._renderComponent(context, {
        module: 'a-jsoneditor',
        name: 'renderJson',
      });
    },
  },
};
