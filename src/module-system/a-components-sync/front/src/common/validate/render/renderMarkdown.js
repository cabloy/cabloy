export default {
  methods: {
    renderMarkdown(c, context) {
      return this._renderComponent(c, context, {
        module: 'a-markdown',
        name: 'renderMarkdown',
      });
    },
  },
};
