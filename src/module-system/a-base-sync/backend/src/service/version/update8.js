module.exports = function(ctx) {

  class VersionUpdate8 {

    async run() {

      let sql;

      // aFunctionScene
      sql = `
          CREATE TABLE aFunctionScene (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            sceneName varchar(50) DEFAULT NULL,
            sceneMenu int(11) DEFAULT '0',
            sceneSorting int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aFunction: scene -> sceneId
      sql = `
        ALTER TABLE aFunction
          CHANGE COLUMN scene sceneId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate8;
};
