export default {
  methods: {
    renderMarkdown(c, context) {
      return this._renderMarkdown_general(c, context);
    },
    renderMarkdownContent(c, context) {
      context = this._renderMarkdown_patchContext(context);
      return this._renderMarkdown_general(c, context);
    },
    renderMarkdownContentCms(c, context) {
      context = this._renderMarkdown_patchContext(context);
      // action
      const action = {
        name: 'cms-content-preview',
        actionModule: 'a-cms',
        actionComponent: 'action',
        icon: { material: 'visibility' },
      };
      // actions
      if (!context.property.ebParams.actions) context.property.ebParams.actions = [];
      context.property.ebParams.actions.push(action);
      return this._renderMarkdown_general(c, context);
    },
    _renderMarkdown_patchContext(context) {
      let { property } = context;
      property = this.$meta.util.extend(
        {
          ebParams: {
            actionSave: true,
            actionDone: true,
          },
        },
        property,
        {
          ebParams: {
            host: this._renderMarkdown_host(context),
          },
        }
      );
      return {
        ...context,
        property,
      };
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
