const constants = require('../../config/constants.js');

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {

      // // update sceneName
      // const scenes = constants.function.scene;
      // for (const sceneName in scenes) {
      //   const sceneValue = scenes[sceneName];
      //   await ctx.model.query('update aFunction set scene=? where scene=?',
      //     [ sceneName, sceneValue ]);
      // }

    }

  }

  return VersionInit;
};
