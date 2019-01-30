const require3 = require('require3');
const extend = require3('extend2');
const chalk = require3('chalk');

module.exports = app => {

  class Version extends app.Service {

    async update(options) {
      // check indexes
      if (this.ctx.config.indexesCheck) {
        const indexes = extend(true, {}, this.ctx.config.indexes, this.ctx.config.indexesExtend);
        for (const moduleRelativeName in indexes) {
          if (this.app.meta.modules[moduleRelativeName]) {
            const moduleIndexes = indexes[moduleRelativeName];
            for (const tableName in moduleIndexes) {
              await this._createIndexesOnTable({ tableName, indexes: moduleIndexes[tableName] });
            }
          }
        }
      }
    }

    async init(options) {
    }

    async test() {
    }

    async _createIndexesOnTable({ tableName, indexes }) {
      try {
        const _indexArray = indexes.split(',');
        const list = await this.ctx.model.query(`show index from ${tableName}`);
        const map = {};
        for (const item of list) {
          map[item.Column_name] = item.Index_type;
        }
        for (const _index of _indexArray) {
          const _arr = _index.split(':');
          const fieldNames = _arr[0];
          const fieldNameArray = fieldNames.split('+');
          const fieldNameFirst = fieldNameArray[0];
          const indexType = _arr[1] || '';
          if (!map[fieldNameFirst]) {
            const sql = `create ${indexType} index idx_${tableName}_${fieldNameArray.join('_')} ON ${tableName} (${fieldNameArray.join(',')})`;
            await this.ctx.model.query(sql);
          }
        }
      } catch (e) {
        // just log the error message
        console.log(chalk.red(e.message));
        if (e.sql) console.log(chalk.red(e.sql));
      }
    }

  }

  return Version;
};
