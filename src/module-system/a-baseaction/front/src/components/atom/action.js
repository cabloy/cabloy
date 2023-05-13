import Vue from 'vue';
import ActionCreate from './action/actionCreate.js';
import ActionRead from './action/actionRead.js';
import ActionDelete from './action/actionDelete.js';
import ActionSave from './action/actionSave.js';
import ActionSubmit from './action/actionSubmit.js';
import ActionWrite from './action/actionWrite.js';
import ActionClone from './action/actionClone.js';
import ActionHistory from './action/actionHistory.js';
import ActionFormal from './action/actionFormal.js';
import ActionDraft from './action/actionDraft.js';
import ActionSelectLocale from './action/actionSelectLocale.js';
import ActionSelectResourceType from './action/actionSelectResourceType.js';
import ActionEnable from './action/actionEnable.js';
import ActionDisable from './action/actionDisable.js';
import ActionWorkflow from './action/actionWorkflow.js';
import ActionWorkflowFormal from './action/actionWorkflowFormal.js';
import ActionLayout from './action/actionLayout.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionCreate,
    ActionRead,
    ActionDelete,
    ActionSave,
    ActionSubmit,
    ActionWrite,
    ActionClone,
    ActionHistory,
    ActionFormal,
    ActionDraft,
    ActionSelectLocale,
    ActionSelectResourceType,
    ActionEnable,
    ActionDisable,
    ActionWorkflow,
    ActionWorkflowFormal,
    ActionLayout,
  ],
  methods: {
    async onAction() {
      const { action } = this.$props;
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (action.name === 'read') {
        return await this._onActionRead();
      } else if (action.name === 'delete') {
        return await this._onActionDelete();
      } else if (action.name === 'save') {
        return await this._onActionSave();
      } else if (action.name === 'submit') {
        return await this._onActionSubmit();
      } else if (action.name === 'write') {
        return await this._onActionWrite();
      } else if (action.name === 'clone') {
        return await this._onActionClone();
      } else if (action.name === 'history') {
        return await this._onActionHistory();
      } else if (action.name === 'formal') {
        return await this._onActionFormal();
      } else if (action.name === 'draft') {
        return await this._onActionDraft();
      } else if (action.name === 'selectLocale') {
        return await this._onActionSelectLocale();
      } else if (action.name === 'selectResourceType') {
        return await this._onActionSelectResourceType();
      } else if (action.name === 'enable') {
        return await this._onActionEnable();
      } else if (action.name === 'disable') {
        return await this._onActionDisable();
      } else if (action.name === 'workflow') {
        return await this._onActionWorkflow();
      } else if (action.name === 'workflowFormal') {
        return await this._onActionWorkflowFormal();
      } else if (action.name === 'layout') {
        return await this._onActionLayout();
      }
    },
    async _onActionReadGeneral({ atomId }) {
      const { ctx, item } = this.$props;
      const actionsAll = await ctx.$store.dispatch('a/base/getActions');
      let actionRead = actionsAll[item.module][item.atomClassName].read;
      actionRead = ctx.$utils.extend({}, actionRead);
      await ctx.$meta.util.performAction({ ctx, action: actionRead, item: { atomId } });
    },
  },
};
