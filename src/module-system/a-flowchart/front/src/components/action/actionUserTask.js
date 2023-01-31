export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'getAtomClassAndStage') {
        return await this.onAction_getAtomClassAndStage({ ctx, item });
      } else if (action.name === 'getSchemaReference') {
        return await this.onAction_getSchemaReference({ ctx, item });
      } else if (action.name === 'schemaReference') {
        return await this.onAction_schemaReference({ ctx, action, item });
      }
    },
    async onAction_getAtomClassAndStage({ ctx, item }) {
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
      // atomClass
      const atomClass = nodeStartEventAtom.options && nodeStartEventAtom.options.atom;
      if (!atomClass || !atomClass.module || !atomClass.atomClassName) {
        ctx.$view.toast.show({ text: this.$text('NotSetStartEventAtom') });
        return;
      }
      // atomStage
      const atomStage = nodeStartEventAtom.options && nodeStartEventAtom.options.atomStage;
      // ok
      return { atomClass, atomStage };
    },
    async onAction_getSchemaReference({ ctx, item }) {
      // atomClass
      const atomClassAndStage = await this.onAction_getAtomClassAndStage({ ctx, item });
      if (!atomClassAndStage) return;
      // validator
      const validator = await ctx.$api.post('/a/base/atom/validator', {
        atomClass: atomClassAndStage.atomClass,
      });
      // schema
      const schemaRes = await ctx.$api.post('/a/validation/validation/schema', {
        module: validator.module,
        validator: validator.validator,
        schema: null,
      });
      // ok
      return schemaRes;
    },
    async onAction_schemaReference({ ctx, action, item }) {
      const schemaRes = await this.onAction_getSchemaReference({ ctx, action, item });
      if (!schemaRes) return;
      const schema = schemaRes.schema;
      // taget
      let target = ctx.$meta.util.getProperty(action, 'navigateOptions.target');
      if (target === undefined) target = '_self';
      // navigate
      ctx.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target,
        context: {
          params: {
            value: schema,
            title: ctx.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
    __findNode_startEventAtom({ diagram, nodeId }) {
      // maybe this node is startEventAtom
      let nodePrevious = diagram.contentProcess.nodes.find(item => item.id === nodeId);
      if (!nodePrevious) return null;
      // loop
      const nodeIdCaches = {};
      while (true) {
        // check first
        if (nodePrevious.type.indexOf('startEventAtom') > -1) return nodePrevious;
        // previous
        nodeIdCaches[nodeId] = true;
        nodePrevious = this.__findNode_previous({ diagram, nodeId, nodeIdCaches });
        if (!nodePrevious) return null;
        nodeId = nodePrevious.id;
      }
    },
    __findNode_previous({ diagram, nodeId, nodeIdCaches }) {
      const edge = diagram.contentProcess.edges.find(item => {
        return item.target === nodeId && !nodeIdCaches[item.source];
      });
      if (!edge) return null;
      return diagram.contentProcess.nodes.find(item => item.id === edge.source);
    },
  },
};
