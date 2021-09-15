export default {
  methods: {
    renderJson(c, context) {
      return this._renderComponent(c, context, {
        module: 'a-jsoneditor',
        name: 'renderJson',
      });
    },
  },
};
