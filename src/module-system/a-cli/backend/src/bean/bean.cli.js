let __commands;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Cli {
    async meta({ argv, user }) {
      // check right first
      const cliFullName = argv.cliFullName;
      const right = await ctx.bean.resource.checkRightResource({
        atomStaticKey: cliFullName,
        user,
      });
      if (!right) ctx.throw(403);
      // command
      const command = this._findCliCommand({ cliFullName });
      return command;
    }

    _findCliCommand({ cliFullName }) {
      if (!__commands) {
        __commands = this._collectCommands();
      }
      const command = __commands[cliFullName];
      if (!command) throw new Error(`cli command not found: ${cliFullName}`);
      return command;
    }

    _collectCommands() {
      const _commands = {};
      for (const module of ctx.app.meta.modulesArray) {
        const commands = module.main.meta && module.main.meta.cli && module.main.meta.cli.commands;
        if (!commands) continue;
        for (const key in commands) {
          const command = commands[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          // bean
          const beanName = command.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.cli.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.cli.${beanName.name}`;
          }
          // ok
          _commands[fullKey] = {
            ...command,
            beanFullName,
          };
        }
      }
      return _commands;
    }
  }
  return Cli;
};
