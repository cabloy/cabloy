import ActionBulkDelete from './actionBulk/actionBulkDelete.js';
import ActionBulkExport from './actionBulk/actionBulkExport.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionBulkDelete, //
    ActionBulkExport,
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
  methods: {
    async onAction() {
      if (this.action.name === 'deleteBulk') {
        return await this._onActionBulkDelete();
      } else if (this.action.name === 'exportBulk') {
        return await this._onActionBulkExport();
      }
    },
  },
};
