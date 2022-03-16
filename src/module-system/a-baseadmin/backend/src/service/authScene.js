module.exports = app => {
  class authScene extends app.Service {
    async disable({ id, sceneName, disabled }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      const providersConfigCache = this.ctx.bean.authProviderCache.getAuthProvidersConfigCache();
      const fullName = `${item.module}:${item.providerName}`;
      const { configProviderScenes } = providersConfigCache[fullName];
      const sceneOld = configProviderScenes[sceneName];
      console.log(sceneOld);
      const sceneNew = this.ctx.bean.authProviderCache.purgeScene({
        ...sceneOld,
        disabled,
      });
      console.log(sceneNew);
      // update
      const scenes = item.scenes ? JSON.parse(item.scenes) : {};
      scenes[sceneName] = sceneNew;
      item.scenes = JSON.stringify(scenes);
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
    }
  }

  return authScene;
};
