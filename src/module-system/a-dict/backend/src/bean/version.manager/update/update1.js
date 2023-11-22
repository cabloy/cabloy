module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate {
    async run(options) {
      // create table: aDict
      let sql = `
        CREATE TABLE aDict (
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
      // create table: aDictContent
      sql = `
        CREATE TABLE aDictContent (
          id int(11) NOT NULL AUTO_INCREMENT,
          createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted int(11) DEFAULT '0',
          iid int(11) DEFAULT '0',
          atomId int(11) DEFAULT '0',
          itemId int(11) DEFAULT '0',
          dictItems JSON DEFAULT NULL,
          dictLocales JSON DEFAULT NULL,
          PRIMARY KEY (id)
        )
      `;
      await ctx.model.query(sql);
      // create view: aDictViewFull
      sql = `
        CREATE VIEW aDictViewFull as
          select a.*,b.dictItems,b.dictLocales from aDict a
            left join aDictContent b on a.id=b.itemId
      `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate;
};
