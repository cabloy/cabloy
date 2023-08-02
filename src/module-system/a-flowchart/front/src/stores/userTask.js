export default {
  state() {
    return {};
  },
  actions: {
    async getAtomClass({ ctx, context }) {
      // atomClass
      const atomClassAndStage = await this.getAtomClassAndStage({ ctx, context });
      if (!atomClassAndStage) return null;
      return atomClassAndStage.atomClass;
    },
    async getAtomClassAndStage({ ctx, context }) {
      // validate
      const { validate } = context;
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
      const atomStage = (nodeStartEventAtom.options && nodeStartEventAtom.options.atomStage) || 0;
      // ok
      return { atomClass, atomStage };
    },
    async getSchemaReference({ ctx, context }) {
      // atomClass
      const atomClassAndStage = await this.getAtomClassAndStage({ ctx, context });
      if (!atomClassAndStage) return null;
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
