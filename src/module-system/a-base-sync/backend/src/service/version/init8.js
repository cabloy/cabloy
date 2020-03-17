const constants = require('../../config/constants.js');

module.exports = function(ctx) {

  class VersionInit {

    async run() {
      // roleFunctions: panels
      const roleFunctions = [
        { roleName: null, name: 'panelMenu' },
        { roleName: null, name: 'panelAtom' },
        { roleName: null, name: 'panelSearch' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });

      // update exists functions
      await this._updateFunctions();
    }

    async _updateFunctions() {
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

  return VersionInit;
};
