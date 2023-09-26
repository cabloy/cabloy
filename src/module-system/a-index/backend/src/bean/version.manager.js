const chalk = require('chalk');

module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      // check indexes
      if (this.ctx.config.indexesCheck) {
        // combine module's indexes
        const moduleIndexes = {};
        for (const relativeName in this.app.meta.modules) {
          const module = this.app.meta.modules[relativeName];
          if (module.main.meta && module.main.meta.index && module.main.meta.index.indexes) {
            moduleIndexes[relativeName] = module.main.meta.index.indexes;
          }
        }
        // combine indexes all
        const indexes = this.ctx.bean.util.extend(
          {},
          this.ctx.config.indexes,
          moduleIndexes,
          this.ctx.config.indexesExtend
        );
        // create indexes
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

    async init(options) {}

    async test() {}

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
            // too long
            // const sql = `create ${indexType} index idx_${tableName}_${fieldNameArray.join('_')} ON ${tableName} (${fieldNameArray.join(',')})`;
            const sql = `create ${indexType} index idx_${tableName}_${fieldNameFirst} ON ${tableName} (${fieldNameArray.join(
              ','
            )})`;
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
