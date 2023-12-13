let __commandsMap;
let __commandsAll;

module.exports = function SelfFactory(ctx) {
  // const moduleInfo = module.info;
  class Cli {
    async meta({ context, user }) {
      try {
        // reload freeze
        ctx.app.meta.reload.freeze();
        // command
        const { argv } = context;
        const cliFullName = argv.cliFullName;
        const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
        // command bean
        const beanCommand = ctx.bean._newBean(command.beanFullName, { command, context });
        if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
        // meta
        return await beanCommand.meta({ user });
      } finally {
        // reload unfreeze
        ctx.app.meta.reload.unfreeze();
      }
    }

    async execute({ progressId, context, user }) {
      // directly
      if (!progressId) {
        await this._progressInBackground({ progressId, context, user });
        return null;
      }
      // create progress
      await ctx.bean.progress.create({ progressId });
      // background
      ctx.meta.util.runInBackground(async ({ ctx }) => {
        const selfInstance = new (SelfFactory(ctx))();
        await selfInstance._progressInBackground({ progressId, context, user });
      });
      // return progressId
      return { progressId };
    }

    async _progressInBackground({ progressId, context, user }) {
      try {
        // reload freeze
        ctx.app.meta.reload.freeze();
        // command
        const { argv } = context;
        const cliFullName = argv.cliFullName;
        const command = await this._findCliCommandAndCheckRight({ cliFullName, user });
        // command bean
        const beanCommand = ctx.bean._newBean(command.beanFullName, { command, context, progressId });
        if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
        // execute
        await beanCommand.execute({ user });
        // progress done
        await ctx.bean.progress.done({ progressId, message: ctx.text('CliDone') });
      } catch (err) {
        // progress error
        let msg = err.message;
        if (msg && typeof msg === 'object') {
          msg = JSON.stringify(msg, null, 2);
        }
        let message;
        if (ctx.app.meta.isProd) {
          message = msg;
        } else {
          message = [msg, err.stack].join('\n');
        }
        await ctx.bean.progress.error({ progressId, message });
        // throw err
        throw err;
      } finally {
        // reload unfreeze
        ctx.app.meta.reload.unfreeze();
      }
    }

    async _findCliCommandAndCheckRight({ cliFullName, user }) {
      // command
      const command = this._findCliCommand({ cliFullName });
      // check right first
      const right = await ctx.bean.resource.checkRightResource({
        atomStaticKey: command.resource.atomStaticKey,
        user,
      });
      if (!right) ctx.throw(403);
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
      for (const module of ctx.app.meta.modulesArray) {
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
            const _command = ctx.bean.util.extend({}, command);
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
  }
  return Cli;
};
