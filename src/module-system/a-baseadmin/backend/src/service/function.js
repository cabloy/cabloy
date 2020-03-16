module.exports = app => {

  class _Function extends app.Service {

    async scenesLoad({ sceneMenu }) {
      return await this.ctx.meta.function.scenesArray({ sceneMenu });
    }

    async scenesSaveSortings({ sceneMenu, sortings }) {
      for (const item of sortings) {
        await this.ctx.model.functionScene.update({ id: item.id, sceneSorting: item.sorting });
      }
    }

  }

  return _Function;
};
