let _instanceList = null;
let _userList = null;
module.exports = class Settings {
  // instance

  instanceList() {
    if (!_instanceList) {
      _instanceList = this._prepareSettingsList('instance');
    }
    return _instanceList;
  }

  async instanceLoad({ module }) {
    const validator = await this.ctx.bean.settings.loadValidatorInstance({ module });
    const data = await this.ctx.bean.settings.loadSettingsInstance({ module });
    return {
      module,
      validator: validator.validator,
      data,
    };
  }

  async instanceSave({ module, data }) {
    await this.ctx.bean.settings.saveSettingsInstance({ module, data });
  }

  // user

  userList() {
    if (!_userList) {
      _userList = this._prepareSettingsList('user');
    }
    return _userList;
  }

  async userLoad({ module }) {
    const validator = await this.ctx.bean.settings.loadValidatorUser({ module });
    const data = await this.ctx.bean.settings.loadSettingsUser({ module });
    return {
      module,
      validator: validator.validator,
      data,
    };
  }

  async userSave({ module, data }) {
    await this.ctx.bean.settings.saveSettingsUser({ module, data });
  }

  //

  _prepareSettingsList(scene) {
    const list = [];
    for (const relativeName in this.app.meta.modules) {
      const module = this.app.meta.modules[relativeName];
      if (module.main.meta && module.main.meta.settings && module.main.meta.settings[scene]) {
        const settings = module.main.meta.settings[scene];
        const item = {
          module: relativeName,
          validator: settings.validator,
        };
        if (settings.actionComponent || settings.actionPath) {
          item.actionModule = item.module;
          item.actionComponent = settings.actionComponent;
          item.actionPath = settings.actionPath;
        }
        list.push(item);
      }
    }
    return list;
  }
};
