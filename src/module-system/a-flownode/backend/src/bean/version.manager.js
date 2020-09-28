module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        // create table: aFlowNodeStartEventAtomCondition
        const sql = `
          CREATE TABLE aFlowNodeStartEventAtomCondition (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassModule varchar(255) DEFAULT NULL,
            atomClassName varchar(255) DEFAULT NULL,
            conditionExpression TEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};
