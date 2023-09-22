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
            description varchar(255) DEFAULT NULL,
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
        //  flowStatus: 1/end
        sql = `
          CREATE TABLE aFlow (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            flowDefRevision int(11) DEFAULT '0',
            flowName varchar(255) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowAtomId int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            flowNodeIdCurrent int(11) DEFAULT '0',
            flowNodeNameCurrent varchar(255) DEFAULT NULL,
            flowUserId int(11) DEFAULT '0',
            timeEnd timestamp DEFAULT NULL,
            flowRemark varchar(255) DEFAULT NULL,
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
            flowNodeName varchar(255) DEFAULT NULL,
            flowNodeType varchar(50) DEFAULT NULL,
            flowNodeIdPrev int(11) DEFAULT '0',
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowHistory
        //  flowStatus: 1/end
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
            flowDefRevision int(11) DEFAULT '0',
            flowName varchar(255) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowAtomId int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            flowNodeIdCurrent int(11) DEFAULT '0',
            flowNodeNameCurrent varchar(255) DEFAULT NULL,
            flowUserId int(11) DEFAULT '0',
            timeEnd timestamp DEFAULT NULL,
            flowRemark varchar(255) DEFAULT NULL,
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
            flowNodeName varchar(255) DEFAULT NULL,
            flowNodeType varchar(50) DEFAULT NULL,
            flowNodeIdPrev int(11) DEFAULT '0',
            flowNodeStatus int(11) DEFAULT '0',
            flowNodeRemark TEXT DEFAULT NULL,
            timeDone timestamp DEFAULT NULL,
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 2) {
        let sql;

        // alter table: aFlow
        sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowHistory
        sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNode
        sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNodeHistory
        sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 3) {
        let sql;

        // alter table: aFlowNode
        sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN behaviorDefId varchar(255) DEFAULT '' 
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNodeHistory
        sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN behaviorDefId varchar(255) DEFAULT ''
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 5) {
        let sql;

        // alter table: aFlow
        sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowHistory
        sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // // add role rights
        // const roleRights = [
        //   { roleName: 'system', action: 'create' },
        //   { roleName: 'system', action: 'read', scopeNames: 0 },
        //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'write', scopeNames: 0 },
        //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'delete', scopeNames: 0 },
        //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'clone', scopeNames: 0 },
        //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'enable', scopeNames: 0 },
        //   { roleName: 'system', action: 'enable', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'disable', scopeNames: 0 },
        //   { roleName: 'system', action: 'disable', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'deleteBulk' },
        //   { roleName: 'system', action: 'exportBulk' },
        // ];
        // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }

      if (options.version === 4) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'enable', scopeNames: 0 },
          { roleName: 'system', action: 'enable', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'disable', scopeNames: 0 },
          { roleName: 'system', action: 'disable', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }
    }

    async test() {
      // flowHistory
      let res = await this.ctx.model.flowHistory.insert({});
      await this.ctx.model.flowHistory.delete({ id: res.insertId });
      // flowNodeHistory
      res = await this.ctx.model.flowNodeHistory.insert({});
      await this.ctx.model.flowNodeHistory.delete({ id: res.insertId });
    }
  }

  return Version;
};
