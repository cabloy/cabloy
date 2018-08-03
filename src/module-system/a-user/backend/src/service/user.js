const _functions = {};

module.exports = app => {

  class User extends app.Service {

    async save({ data, user }) {
      data.id = user.id;
      return await this.ctx.meta.user.save({ user: data });
    }

    async agent({ userId }) {
      return await this.ctx.meta.user.agent({ userId });
    }

    async agentsBy({ userId }) {
      return await this.ctx.meta.user.agentsBy({ userId });
    }

    async userByMobile({ mobile }) {
      return await this.ctx.meta.user.exists({ mobile });
    }

    async addAgent({ userIdAgent, userId }) {
      return await this.ctx.meta.user.addAgent({ userIdAgent, userId });
    }

    async removeAgent({ userIdAgent, userId }) {
      return await this.ctx.meta.user.removeAgent({ userIdAgent, userId });
    }

    async switchAgent({ userIdAgent }) {
      return await this.ctx.meta.user.switchAgent({ userIdAgent });
    }

    async switchOffAgent() {
      return await this.ctx.meta.user.switchOffAgent();
    }

    functions() {
      if (!_functions[this.ctx.locale]) {
        _functions[this.ctx.locale] = this._prepareFunctions();
      }
      return _functions[this.ctx.locale];
    }

    _prepareFunctions() {
      const functions = {};
      for (const relativeName in this.ctx.app.meta.modules) {
        const module = this.ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.user && module.main.meta.user.functions) {
          functions[relativeName] = this._prepareFunctionsModule(module, module.main.meta.user.functions);
        }
      }
      return functions;
    }

    _prepareFunctionsModule(module, _functions) {
      const functions = {};
      for (const key in _functions) {
        const _func = _functions[key];
        const func = {
          name: key,
          title: _func.title || key,
          module: module.info.relativeName,
          actionModule: _func.actionModule || module.info.relativeName,
          actionComponent: _func.actionComponent,
          actionPath: _func.actionPath,
        };
        func.titleLocale = this.ctx.text(func.title);
        functions[key] = func;
      }
      return functions;
    }

  }

  return User;
};
