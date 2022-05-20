module.exports = function (ctx) {
  class VersionUpdate16 {
    async run() {
      // aResource: add resourceIcon/appKey
      let sql = `
        ALTER TABLE aResource
          Add COLUMN resourceIcon varchar(255) DEFAULT NULL,
          Add COLUMN appKey varchar(50) DEFAULT NULL
      `;
      await ctx.model.query(sql);
      // create view: aResourceView
      sql = `
      CREATE VIEW aResourceView as
        select a.*,b.id as appAtomId,b.atomName as appName from aResource a
          left join aAtom b on a.iid=b.iid and b.deleted=0 and a.appKey=b.atomStaticKey and b.atomStage=1
    `;
      await ctx.model.query(sql);
    }
  }

  return VersionUpdate16;
};
