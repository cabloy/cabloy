export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'schemaReference') {
        return await this.onAction_schemaReference({ ctx, action, item });
      }
    },
    async onAction_schemaReference({ ctx, action, item }) {
      // validate
      const { validate } = item;
      // container
      const container = validate.host.container;
      // diagram
      const diagram = container.diagram;
      // nodeId
      const nodeId = container.id;
      // find node
      const nodeStartEventAtom = this.__findNode_startEventAtom({ diagram, nodeId });
      if (!nodeStartEventAtom) {
        ctx.$view.toast.show({ text: this.$text('NotFoundStartEventAtom') });
        return;
      }
      // value
      const res = await ctx.$api.post('/a/instance/instance/getConfigsPreview');
      // taget
      let target = ctx.$meta.util.getProperty(action, 'navigateOptions.target');
      if (target === undefined) target = '_self';
      // navigate
      ctx.$view.navigate(`/a/basefront/json/editor?t=${Date.now()}`, {
        target,
        context: {
          params: {
            value: res.data,
            title: ctx.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
    __findNode_startEventAtom({ diagram, nodeId }) {

    },
  },
};
