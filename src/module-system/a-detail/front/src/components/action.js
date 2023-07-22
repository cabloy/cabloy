import Vue from 'vue';
import ActionCreate from './action/actionCreate.js';
import ActionWrite from './action/actionWrite.js';
import ActionDelete from './action/actionDelete.js';
import ActionSave from './action/actionSave.js';
import ActionRead from './action/actionRead.js';
import ActionClone from './action/actionClone.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionCreate,
    ActionWrite,
    ActionDelete,
    ActionSave,
    ActionRead,
    ActionClone,
  ],
  data() {
    return {
      detailItem: null,
      meta: null,
      //
      flowTaskId: 0,
      atomKey: null,
      detailKey: null,
      detailClass: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // detailItem
      this.detailItem = this.item.item;
      // meta
      this.meta = this.item.meta;
      // flowTaskId
      this.flowTaskId = (this.meta && this.meta.flowTaskId) || 0;
      // atomKey
      this.atomKey = { atomId: this.detailItem.atomId };
      // key
      this.detailKey = {
        detailId: this.detailItem.detailId,
        detailItemId: this.detailItem.detailItemId,
      };
      // detailClass
      this.detailClass = {
        module: this.detailItem.module,
        detailClassName: this.detailItem.detailClassName,
      };
    },
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (actionName === 'delete') {
        return await this._onActionDelete();
      } else if (actionName === 'save') {
        return await this._onActionSave();
      } else if (actionName === 'read') {
        return await this._onActionRead();
      } else if (actionName === 'write') {
        return await this._onActionWrite();
      } else if (actionName === 'clone') {
        return await this._onActionClone();
      } else if (actionName === 'moveUp') {
        return await this._onActionMoveUp();
      } else if (actionName === 'moveDown') {
        return await this._onActionMoveDown();
      }
    },
  },
};
