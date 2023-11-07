const assert = require('assert');

module.exports = app => {
  class Broadcast extends app.meta.BeanBase {
    async execute(context) {
      const sameAsCaller = context.sameAsCaller;
      const { mode, tableName } = context.data;
      if (!sameAsCaller) {
        // clear columns cache
        if (mode === 'all') {
          this.ctx.model.columnsClearAll();
        } else {
          this.ctx.model.columnsClear(tableName);
        }
      }
    }
  }

  return Broadcast;
};
