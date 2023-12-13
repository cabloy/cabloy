module.exports = function SelfFactory(ctx) {
  // const moduleInfo = module.info;
  class VersionUpdate {
    async run(options) {
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
      await ctx.model.query(sql);

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
      await ctx.model.query(sql);

      // create view: aFlowDefViewFull
      sql = `
          CREATE VIEW aFlowDefViewFull as
            select a.*,b.content from aFlowDef a
              left join aFlowDefContent b on a.id=b.itemId
        `;
      await ctx.model.query(sql);

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
      await ctx.model.query(sql);

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
      await ctx.model.query(sql);

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
      await ctx.model.query(sql);

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
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
