module.exports = app => {
  class Version extends app.meta.BeanBase {
    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aFlowNodeStartEventAtomCondition
        sql = `
          CREATE TABLE aFlowNodeStartEventAtomCondition (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            startEventId varchar(255) DEFAULT NULL,
            atomClassId int(11) DEFAULT '0',
            conditionExpression TEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowTask
        sql = `
          CREATE TABLE aFlowTask (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowTaskStatus int(11) DEFAULT '0',
            flowTaskHidden int(11) DEFAULT '0',
            userIdAssignee int(11) DEFAULT '0',
            specificFlag int(11) DEFAULT '0',
            handleStatus int(11) DEFAULT '0',
            handleRemark TEXT DEFAULT NULL,
            timeClaimed timestamp DEFAULT NULL,
            timeHandled timestamp DEFAULT NULL,
            taskVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowTaskHistory
        sql = `
          CREATE TABLE aFlowTaskHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowTaskId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowTaskStatus int(11) DEFAULT '0',
            flowTaskHidden int(11) DEFAULT '0',
            userIdAssignee int(11) DEFAULT '0',
            specificFlag int(11) DEFAULT '0',
            handleStatus int(11) DEFAULT '0',
            handleRemark TEXT DEFAULT NULL,
            timeClaimed timestamp DEFAULT NULL,
            timeHandled timestamp DEFAULT NULL,
            taskVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        let sql;

        // aFlowTask
        sql = `
          ALTER TABLE aFlowTask
            ADD COLUMN ignoreMark int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardTo int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteTo int(11) DEFAULT '0'
                `;
        await this.ctx.model.query(sql);

        // aFlowTaskHistory
        sql = `
          ALTER TABLE aFlowTaskHistory
            ADD COLUMN ignoreMark int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardTo int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteTo int(11) DEFAULT '0'
                `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};
