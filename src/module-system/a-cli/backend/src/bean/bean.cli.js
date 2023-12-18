let __commandsMap;
let __commandsAll;

// const moduleInfo = module.info;
module.exports = class Cli {
  async meta({ context, user }) {
    try {
      // reload freeze
      this.ctx.app.meta.reload.freeze();
      // command
      const { argv } = context;
      const cliFullName = argv.cliFullName;
      const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
      // command bean
      const beanCommand = this.ctx.bean._newBean(command.beanFullName, { command, context });
      if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
      // meta
      return await beanCommand.meta({ user });
    } finally {
      // reload unfreeze
      this.ctx.app.meta.reload.unfreeze();
    }
  }

  async execute({ progressId, context, user }) {
    // directly
    if (!progressId) {
      await this._progressInBackground({ progressId, context, user });
      return null;
    }
    // create progress
    await this.ctx.bean.progress.create({ progressId });
    // background
    this.ctx.meta.util.runInBackground(async ({ ctx }) => {
      const selfInstance = ctx.bean._newBean(Cli);
      await selfInstance._progressInBackground({ progressId, context, user });
    });
    // return progressId
    return { progressId };
  }

  async _progressInBackground({ progressId, context, user }) {
    try {
      // reload freeze
      this.ctx.app.meta.reload.freeze();
      // command
      const { argv } = context;
      const cliFullName = argv.cliFullName;
      const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
      // command bean
      const beanCommand = this.ctx.bean._newBean(command.beanFullName, { command, context, progressId });
      if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
      // execute
      await beanCommand.execute({ user });
      // progress done
      await this.ctx.bean.progress.done({ progressId, message: this.ctx.text('CliDone') });
    } catch (err) {
      // progress error
      const msg = err.message;
      let msgObject;
      if (msg && typeof msg === 'object') {
        msgObject = JSON.stringify(msg, null, 2);
      }
      let message;
      if (this.ctx.app.meta.isProd) {
        message = msgObject || msg;
      } else {
        if (msgObject) {
          message = [msgObject, err.stack].join('\n');
        } else {
          message = err.stack;
        }
      }
      await this.ctx.bean.progress.error({ progressId, message });
      // throw err
      throw err;
    } finally {
      // reload unfreeze
      this.ctx.app.meta.reload.unfreeze();
    }
  }

  async _findCliCommandAndCheckRight({ cliFullName, user }) {
    // command
    const command = this._findCliCommand({ cliFullName });
    // check right first
    const right = await this.ctx.bean.resource.checkRightResource({
      atomStaticKey: command.resource.atomStaticKey,
      user,
    });
    if (!right) this.ctx.throw(403);
    return command;
  }

  _findCliCommand({ cliFullName }) {
    if (!__commandsMap) {
      this._collectCommands();
    }
    const command = __commandsMap[cliFullName];
    if (!command) throw new Error(`cli command not found: ${cliFullName}`);
    return command;
  }

  _commandsAll() {
    return __commandsAll;
  }

  _collectCommands() {
    const _commandsMap = {};
    const _commandsAll = {};
    for (const module of this.ctx.app.meta.modulesArray) {
      const moduleName = module.info.relativeName;
      const commands = module.main.meta && module.main.meta.cli && module.main.meta.cli.commands;
      if (!commands) continue;
      const _commandsModule = (_commandsAll[moduleName] = {});
      for (const groupName in commands) {
        const group = commands[groupName];
        const _commandsGroup = (_commandsModule[groupName] = {});
        for (const key in group) {
          const command = group[key];
          const fullKey = `${moduleName}:${groupName}:${key}`;
          // command
          const _command = this.ctx.bean.util.extend({}, command);
          // bean
          const beanName = command.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${moduleName}.cli.${beanName}`;
          } else {
            beanFullName = `${beanName.module || moduleName}.cli.${beanName.name}`;
          }
          _command.beanFullName = beanFullName;
          // resource
          let atomStaticKey = _command.resource && _command.resource.atomStaticKey;
          if (!atomStaticKey) throw new Error(`cli command resource.atomStaticKey not specified: ${fullKey}`);
          if (atomStaticKey.indexOf(':') === -1) {
            atomStaticKey = `${moduleName}:${atomStaticKey}`;
          }
          _command.resource.atomStaticKey = atomStaticKey;
          // ok
          _commandsMap[fullKey] = _commandsGroup[key] = _command;
        }
      }
    }
    // ok
    __commandsMap = _commandsMap;
    __commandsAll = _commandsAll;
  }
};
