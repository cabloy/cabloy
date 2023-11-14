module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
    async deploy({ flowDefId, undeploy, deleting }) {
      // start event
      const res = await this._deploy_startEvent({ flowDefId, undeploy, deleting });
      const atomClass = res?.atomClass;
      // atom state
      if (atomClass) {
        await this._deploy_atomState({ atomClass });
      }
    }

    async _deploy_atomState({ atomClass }) {
      // all flowDefs
      const _nodeBaseBean = ctx.bean._newBean('a-flowtask.flow.node.startEventAtom');
      const list = await _nodeBaseBean._getAllConditions({ atomClassId: atomClass.id });
      const flowDefs = await ctx.bean.atom.select({
        atomClass: this.atomClass,
        options: {
          stage: 'formal',
          where: {
            'a.id': {
              op: 'in',
              val: list.map(item => item.flowDefId),
            },
          },
          mode: 'full',
        },
        user: null,
        pageForce: false,
      });
      // vars
      const titleStateStart = null;
      const titleStateEnd = null;
      const dictItems = [];
      // loop
      for (const flowDef of flowDefs) {
        const dictItems_flowDef = this._deploy_atomState_handleFlowDef({ flowDef });
      }
      console.log(flowDefs);
    }

    _deploy_atomState_handleFlowDef({ flowDef }) {
      const dictItems = [];
    }

    async _deploy_startEvent({ flowDefId, undeploy, deleting }) {
      // flowDef
      const flowDef = await this._getById({ flowDefId });
      if (!flowDef) return;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content || !content.process) return;
      // all startEvents
      let atomClass;
      for (const node of content.process.nodes) {
        const nodeType = node.type;
        if (nodeType.indexOf('startEvent') === -1) continue;
        const _nodeBase = this._getFlowNodeBase(nodeType);
        const _nodeBaseBean = ctx.bean._newBean(_nodeBase.beanFullName);
        if (_nodeBaseBean.deploy) {
          const res = await _nodeBaseBean.deploy({
            deploy: !undeploy && flowDef.atomDisabled === 0,
            flowDefId,
            node,
            deleting,
            flowDef,
            content,
          });
          if (res?.atomClass) {
            atomClass = res?.atomClass;
          }
        }
      }
      // return
      return { atomClass };
    }
  }

  return FlowDef;
};
