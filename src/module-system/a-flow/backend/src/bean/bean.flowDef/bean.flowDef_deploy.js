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
      const conditions = await _nodeBaseBean._getAllConditions({ atomClassId: atomClass.id, needFlowContent: true });
      // vars
      let dictItemStart = null;
      let dictItemEnd = null;
      let dictItems = [];
      const dictLocales = {};
      const needGroup = conditions.length > 1;
      // loop
      for (const condition of conditions) {
        const flowDefId = condition.flowDefId;
        const startEventId = condition.startEventId;
        const content = condition.content ? JSON.parse(condition.content) : null;
        const flowName = condition.atomName;
        const { nodeStart, nodeEnd, nodeTasks } = await this._deploy_atomState_findNodes({
          flowDefId,
          startEventId,
          content,
        });
        // start
        if (!dictItemStart) {
          dictItemStart = this._deploy_atomState_combineDictItem({ flowDefId, node: nodeStart, code: 1, dictLocales });
        }
        // end
        if (!dictItemEnd) {
          dictItemEnd = this._deploy_atomState_combineDictItem({ flowDefId, node: nodeEnd, code: -1, dictLocales });
        }
        // items
        const dictItemsTask = this._deploy_atomState_combineDictItemsTask({ flowDefId, nodeTasks, dictLocales });
        if (dictItemsTask.length === 0) {
          // no tasks
          continue;
        }
        // append
        if (needGroup) {
          const nodeGroup = { name: flowName };
          const dictGroup = this._deploy_atomState_combineDictItem({
            flowDefId,
            node: nodeGroup,
            code: `${flowDefId}:__group__`,
            title: flowName,
            dictLocales,
          });
          dictGroup.options = {
            group: true,
          };
          dictItems.push(dictGroup);
        }
        dictItems = dictItems.concat(dictItemsTask);
      }
      // append start
      dictItems.unshift(dictItemStart);
      // append end
      dictItems.push(dictItemEnd);
      // save
      await this._deploy_atomState_save({ atomClass, dictItems, dictLocales });
      // ok
      console.log(dictItems);
      console.log(dictLocales);
    }

    async _deploy_atomState_save({ atomClass, dictItems, dictLocales }) {}

    async _deploy_atomState_findNodes({ startEventId, content }) {
      let nodeStart = null;
      let nodeEnd = null;
      const nodeTasks = await ctx.bean.flowDef._loopNodes({
        content,
        nodeIdStart: startEventId,
        fn: async ({ nodes, node }) => {
          // check if startEvent
          if (node.id === startEventId) {
            nodeStart = node;
            return;
          }
          // check if endEvent
          if (node.type.indexOf('endEventAtom') > -1) {
            nodeEnd = node;
            return;
          }
          // check if other endEvent
          if (node.type.indexOf('endEvent') > -1) {
            return;
          }
          // check if activityUserTask
          if (node.type.indexOf('activityUserTask') > -1) {
            nodes.push(node);
          }
        },
      });
      return { nodeStart, nodeEnd, nodeTasks };
    }

    _deploy_atomState_combineDictItemsTask({ flowDefId, nodeTasks, dictLocales }) {
      const dictItems = [];
      const codesCache = {};
      for (const nodeTask of nodeTasks) {
        const dictItem = this._deploy_atomState_combineDictItem({ flowDefId, node: nodeTask, dictLocales, codesCache });
        if (dictItem) {
          dictItems.push(dictItem);
        }
      }
      return dictItems;
    }

    _deploy_atomState_combineDictItem({ flowDefId, node, code, title, dictLocales, codesCache }) {
      // name
      const name = node.nameState || node.name;
      // code
      if (!code) {
        code = `${flowDefId}:${name}`;
      }
      if (codesCache && codesCache[code]) {
        // exists
        return null;
      }
      // title
      if (!title) {
        title = name;
      }
      // dict item
      const dictItem = {
        code,
        title,
      };
      // dict locales
      const locales = ctx.bean.base.locales();
      for (const locale of locales) {
        const language = locale.value;
        const text = ctx.text.locale(language, title);
        if (text !== title) {
          if (!dictLocales[language]) {
            dictLocales[language] = {};
          }
          dictLocales[language][title] = text;
        }
      }
      // ok
      return dictItem;
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
