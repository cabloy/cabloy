module.exports = app => {
  class authScene extends app.Service {
    async disable({ id, sceneName, disabled }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      const providersConfigCache = this.ctx.bean.authProviderCache.getAuthProvidersConfigCache();
      const fullName = `${item.module}:${item.providerName}`;
      const { configProviderScenes } = providersConfigCache[fullName];
      const sceneOld = configProviderScenes[sceneName];
      const sceneNew = this.ctx.bean.authProviderCache.purgeScene({
        ...sceneOld,
        disabled,
      });
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

    async save({ id, sceneName, data }) {
      // item
      const item = await this.ctx.model.authProvider.get({ id });
      const providersConfigCache = this.ctx.bean.authProviderCache.getAuthProvidersConfigCache();
      const fullName = `${item.module}:${item.providerName}`;
      const { authProvider, configProviderScenes } = providersConfigCache[fullName];
      // validate data
      const meta = authProvider.meta;
      await this.ctx.bean.validation.validate({
        module: meta.validator.module,
        validator: meta.validator.validator,
        data,
        filterOptions: true,
      });
      // combine
      const sceneOld = configProviderScenes[sceneName];
      const sceneNew = this.ctx.bean.authProviderCache.purgeScene({
        ...sceneOld,
        ...data,
      });
      // update
      if (!meta.scene) {
        item.config = JSON.stringify(sceneNew);
      } else {
        const scenes = item.scenes ? JSON.parse(item.scenes) : {};
        scenes[sceneName] = sceneNew;
        item.scenes = JSON.stringify(scenes);
      }
      await this.ctx.model.authProvider.update(item);
      // changed
      this.ctx.bean.authProviderCache.authProviderChanged({
        module: item.module,
        providerName: item.providerName,
      });
      // ok
      return { data };
    }
  }

  return authScene;
};
