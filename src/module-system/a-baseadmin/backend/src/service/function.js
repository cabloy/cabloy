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

    async sceneItemsLoad({ sceneMenu, sceneId }) {
      const list = await this.ctx.model.query(`
        select b.id,b.module,b.name,b.title,b.sorting,f.titleLocale from aFunction b
          left join aFunctionLocale f on b.id=f.functionId
          left join aFunctionScene g on g.id=b.sceneId
            where b.iid=? and b.sceneId=? and f.locale=?
            order by b.sorting
        `, [ this.ctx.instance.id, sceneId, this.ctx.locale ]);
      return list;
    }

    async sceneItemsSaveSortings({ sceneMenu, sceneId, sortings }) {
      for (const item of sortings) {
        await this.ctx.model.function.update({ id: item.id, sorting: item.sorting });
      }
    }

  }

  return _Function;
};
