module.exports = app => {

  class _Function extends app.Service {

    async scenesLoad({ sceneMenu }) {
      return await this.ctx.meta.function.scenesArray({ sceneMenu });
    }

  }

  return _Function;
};
