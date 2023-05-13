import Vue from 'vue';
import ActionBulkDelete from './actionBulk/actionBulkDelete.js';
import ActionBulkExport from './actionBulk/actionBulkExport.js';
import ActionBulkImport from './actionBulk/actionBulkImport.js';
import ActionBulkLayout from './actionBulk/actionBulkLayout.js';
import ActionBulkDraftStats from './actionBulk/actionBulkDraftStats.js';
import ActionBulkRead from './actionBulk/actionBulkRead.js';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
    ActionBulkDelete,
    ActionBulkExport,
    ActionBulkImport,
    ActionBulkLayout,
    ActionBulkDraftStats,
    ActionBulkRead,
  ],
  methods: {
    async onAction() {
      if (this.action.name === 'deleteBulk') {
        return await this._onActionBulkDelete();
      } else if (this.action.name === 'exportBulk') {
        return await this._onActionBulkExport();
      } else if (this.action.name === 'importBulk') {
        return await this._onActionBulkImport();
      } else if (this.action.name === 'layoutBulk') {
        return await this._onActionBulkLayout();
      } else if (this.action.name === 'draftStatsBulk') {
        return await this._onActionBulkDraftStats();
      } else if (this.action.name === 'readBulk') {
        return await this._onActionBulkRead();
      }
    },
  },
};
