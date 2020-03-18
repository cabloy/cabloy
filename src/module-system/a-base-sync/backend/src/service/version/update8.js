const constants = require('../../config/constants.js');

module.exports = function(ctx) {

  class VersionUpdate8 {

    async run(options) {

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

      // update exists functions
      await this._updateFunctions(options);


      // aAtom: add field roleIdOwner
      sql = `
        ALTER TABLE aAtom
          ADD COLUMN roleIdOwner int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // aViewRoleRightAtomClass
      sql = `
        create view aViewRoleRightAtomClass as
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope from aRoleExpand a
            inner join aRoleRight b on a.roleIdBase=b.roleId
          `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClassRole
      sql = `
        create view aViewUserRightAtomClassRole as
          select a.iid,a.userId as userIdWho,b.atomClassId,b.action,c.roleId as roleIdWhom from aViewUserRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aRoleRef c on b.roleIdScope=c.roleIdParent
          `;
      await ctx.model.query(sql);

      // aViewUserRightAtomRole
      sql = `
        create view aViewUserRightAtomRole as
          select a.iid, a.id as atomId,a.roleIdOwner as roleIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassRole b
            where a.deleted=0 and a.atomEnabled=1
              and a.atomClassId=b.atomClassId
              and a.roleIdOwner=b.roleIdWhom
        `;
      await ctx.model.query(sql);
    }

    async _updateFunctions(options) {
      // all instances
      const instances = await ctx.model.query('select * from aInstance');
      for (const instance of instances) {
        await ctx.performAction({
          subdomain: instance.name,
          method: 'post',
          url: 'version/update8FunctionScenes',
          body: options,
        });
      }
    }

    async _updateFunctionsInstance() {
      // update sceneName
      const scenes = constants.function.scene;
      for (const sceneName in scenes) {
        const sceneValue = scenes[sceneName];
        const sceneId = await ctx.meta.function.getSceneId({ sceneName, sceneMenu: 1 });
        await ctx.model.query('update aFunction set sceneId=? where iid=? and sceneId=?',
          [ sceneId, ctx.instance.id, sceneValue ]);
      }
    }

  }

  return VersionUpdate8;
};
