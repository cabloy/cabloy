module.exports = class authScene {
  async disable({ id, sceneName, disabled }) {
    // item
    const item = await this.ctx.model.authProvider.get({ id });
    // update
    const scenes = item.scenes ? JSON.parse(item.scenes) : {};
    if (!scenes[sceneName]) {
      scenes[sceneName] = {};
    }
    scenes[sceneName].disabled = disabled;
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
    const authProvider = this.ctx.bean.authProvider.getAuthProviderBase({
      module: item.module,
      providerName: item.providerName,
    });
    // validate data
    const meta = authProvider.meta;
    const metaScene = this._getMetaScene(authProvider, sceneName);
    if (metaScene.validator.validator !== 'json') {
      await this.ctx.bean.validation.validate({
        module: metaScene.validator.module,
        validator: metaScene.validator.validator,
        data,
        filterOptions: true,
      });
    }
    // update
    if (!meta.scene) {
      item.config = JSON.stringify(data);
    } else {
      const scenes = item.scenes ? JSON.parse(item.scenes) : {};
      if (!scenes[sceneName]) {
        scenes[sceneName] = {};
      }
      scenes[sceneName] = {
        ...data,
        disabled: scenes[sceneName].disabled,
      };
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

  async add({ id, sceneName, data }) {
    // item
    const item = await this.ctx.model.authProvider.get({ id });
    // update
    const scenes = item.scenes ? JSON.parse(item.scenes) : {};
    scenes[sceneName] = data;
    item.scenes = JSON.stringify(scenes);
    await this.ctx.model.authProvider.update(item);
    // changed
    this.ctx.bean.authProviderCache.authProviderChanged({
      module: item.module,
      providerName: item.providerName,
    });
  }

  async delete({ id, sceneName }) {
    // item
    const item = await this.ctx.model.authProvider.get({ id });
    // update
    const scenes = item.scenes ? JSON.parse(item.scenes) : {};
    delete scenes[sceneName];
    item.scenes = JSON.stringify(scenes);
    await this.ctx.model.authProvider.update(item);
    // changed
    this.ctx.bean.authProviderCache.authProviderChanged({
      module: item.module,
      providerName: item.providerName,
    });
  }

  _getMetaScene(item, sceneName) {
    const meta = item.meta;
    if (meta.scene) {
      const scene = item.scenes && item.scenes[sceneName];
      return (scene && scene.meta) || meta;
    }
    return meta;
  }
};
