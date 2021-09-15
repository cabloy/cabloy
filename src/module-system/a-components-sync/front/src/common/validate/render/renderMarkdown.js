export default {
  methods: {
    renderMarkdown(c, context) {
      return this._renderMarkdown_general(c, context);
    },
    renderMarkdownContent(c, context) {
      let { property } = context;
      property = Object.assign({}, property, {
        ebParams: {
          host: this._renderMarkdown_host(context),
        },
      });
      context = {
        ...context,
        property,
      };
      return this._renderMarkdown_general(c, context);
    },
    renderMarkdownContentCms(c, context) {
      let { property } = context;
      property = Object.assign({}, property, {
        ebParams: {
          host: this._renderMarkdown_host(context),
          actions: [
            {
              name: 'preview',
              actionModule: 'a-cms',
              actionComponent: 'action',
              icon: { material: 'visibility' },
            },
          ],
        },
      });
      context = {
        ...context,
        property,
      };
      return this._renderMarkdown_general(c, context);
    },
    _renderMarkdown_general(c, context) {
      return this._renderComponent(c, context, {
        module: 'a-markdown',
        name: 'renderMarkdown',
      });
    },
    _renderMarkdown_host(context) {
      const { parcel } = context;
      const atom = parcel.data;
      return {
        atomId: atom.atomId,
        atom,
      };
    },
  },
};
