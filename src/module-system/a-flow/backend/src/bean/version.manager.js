module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aFlowDef
        sql = `
          CREATE TABLE aFlowDef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            version varchar(50) DEFAULT NULL,
            description varchar(255) DEFAULT NULL,
            dynamic int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowDefContent
        sql = `
          CREATE TABLE aFlowDefContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aFlowDefViewFull
        sql = `
          CREATE VIEW aFlowDefViewFull as
            select a.*,b.content from aFlowDef a
              left join aFlowDefContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

        // create table: aFlow
        //  flowStatus: 1/COMPLETED, 2/CANCELLED
        sql = `
          CREATE TABLE aFlow (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            version varchar(50) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowNode
        sql = `
          CREATE TABLE aFlowNode (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeDefId varchar(255) DEFAULT NULL,
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowHistory
        //  flowStatus: 1/COMPLETED, 2/CANCELLED
        sql = `
          CREATE TABLE aFlowHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            version varchar(50) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowNodeHistory
        sql = `
          CREATE TABLE aFlowNodeHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowNodeDefId varchar(255) DEFAULT NULL,
            flowNodeStatus int(11) DEFAULT '0',
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'superuser' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }
    }

    async test() {
    }

  }

  return Version;
};
