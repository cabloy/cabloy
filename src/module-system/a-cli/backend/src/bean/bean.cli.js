let __commandsMap;
let __commandsAll;

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
      // command bean
      const beanCommand = ctx.bean._getBean(command.beanFullName);
      if (!beanCommand) throw new Error(`cli command bean not found: ${command.beanFullName}`);
      return await beanCommand.meta({ command, argv, user });
    }

    _findCliCommand({ cliFullName }) {
      if (!__commandsMap) {
        this._collectCommands();
      }
      const command = __commandsMap[cliFullName];
      if (!command) throw new Error(`cli command not found: ${cliFullName}`);
      return command;
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
            // bean
            const beanName = command.bean;
            let beanFullName;
            if (typeof beanName === 'string') {
              beanFullName = `${moduleName}.cli.${beanName}`;
            } else {
              beanFullName = `${beanName.module || moduleName}.cli.${beanName.name}`;
            }
            // ok
            _commandsMap[fullKey] = _commandsGroup[key] = {
              ...command,
              beanFullName,
            };
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
