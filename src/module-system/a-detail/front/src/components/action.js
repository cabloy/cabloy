import ActionCreate from './action/actionCreate.js';
import ActionWrite from './action/actionWrite.js';
import ActionDelete from './action/actionDelete.js';
import ActionSave from './action/actionSave.js';
import ActionRead from './action/actionRead.js';
import ActionClone from './action/actionClone.js';
import ActionMoveUp from './action/actionMoveUp.js';
import ActionMoveDown from './action/actionMoveDown.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionCreate, //
    ActionWrite,
    ActionDelete,
    ActionSave,
    ActionRead,
    ActionClone,
    ActionMoveUp,
    ActionMoveDown,
  ],
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
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
      // do
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (action.name === 'delete') {
        return await this._onActionDelete();
      } else if (action.name === 'save') {
        return await this._onActionSave();
      } else if (action.name === 'read') {
        return await this._onActionRead();
      } else if (action.name === 'write') {
        return await this._onActionWrite();
      } else if (action.name === 'clone') {
        return await this._onActionClone();
      } else if (action.name === 'moveUp') {
        return await this._onActionMoveUp();
      } else if (action.name === 'moveDown') {
        return await this._onActionMoveDown();
      }
    },
  },
};
