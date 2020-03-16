const constants = require('../../config/constants.js');

module.exports = function(ctx) {

  class VersionUpdate9 {

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
            scene varchar(50) DEFAULT NULL,
            menu int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
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

      // update exists functions
      await this._updateFunctions();

    }

    async _updateFunctions() {
      // all instances
      const instances = await ctx.model.query('select * from aInstance');
      for (const instance of instances) {
        await this._updateFunctionsInstance(instance.id);
      }
    }

    async _updateFunctionsInstance(iid) {
      // update sceneName
      const scenes = constants.function.scene;
      for (const sceneName in scenes) {
        const sceneValue = scenes[sceneName];
        const sceneId = await ctx.meta.function.getSceneId({ iid, scene: sceneName, menu: 1 });
        await ctx.model.query('update aFunction set sceneId=? where iid=? and sceneId=?',
          [ sceneId, iid, sceneValue ]);
      }
    }

  }

  return VersionUpdate9;
};
