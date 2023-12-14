module.exports = class Cli extends module.meta.class.CliBase {
  async execute({ user }) {
    const { argv } = this.context;
    // super
    await super.execute({ user });
    // module/group
    const moduleWant = argv.module;
    let groupWant = argv.group;
    if (!moduleWant) groupWant = null;
    // commandsAll
    const commandsAll = this.ctx.bean.cli._commandsAll();
    // modulesShow
    let modulesShow;
    if (moduleWant) {
      if (!commandsAll[moduleWant]) throw new Error(`cli module not found: ${moduleWant}`);
      modulesShow = [moduleWant];
    } else {
      modulesShow = Object.keys(commandsAll);
    }
    // loop
    const total = modulesShow.length;
    for (let index = 0; index < total; index++) {
      const moduleShow = modulesShow[index];
      // log
      await this.console.log({
        progressNo: 0,
        total,
        progress: index,
        text: moduleShow,
      });
      // show
      await this._moduleShow({ moduleShow, groupWant, commandsAll });
    }
    // await this.console.log({ text: JSON.stringify(modulesWant) });
  }

  async _moduleShow({ moduleShow, groupWant, commandsAll }) {
    // _module
    const _module = commandsAll[moduleShow];
    // groupsShow
    let groupsShow;
    if (groupWant) {
      if (!_module[groupWant]) throw new Error(`cli module group not found: ${moduleShow}:${groupWant}`);
      groupsShow = [groupWant];
    } else {
      groupsShow = Object.keys(_module);
    }
    // table
    const table = this.helper.newTable({
      head: ['Command', 'Version', 'Description'],
      colWidths: [30, 10, 40],
    });
    // group
    const groupCount = groupsShow.length;
    for (let index = 0; index < groupCount; index++) {
      const groupShow = groupsShow[index];
      const _group = _module[groupShow];
      for (const commandName in _group) {
        const _command = _group[commandName];
        const cliFullName = this._combineCliFullName({ moduleShow, groupShow, commandName });
        const version = _command.info.version;
        const description = this.ctx.text(_command.info.description || _command.info.title);
        table.push([cliFullName, version, description]);
      }
      if (index < groupCount - 1) {
        table.push([]);
      }
    }
    // log
    await this.console.log({ text: table.toString() });
  }

  _combineCliFullName({ moduleShow, groupShow, commandName }) {
    const parts = [];
    if (moduleShow === 'a-clibooster') {
      parts.push('');
    } else {
      parts.push(moduleShow);
    }
    if (groupShow === 'default') {
      parts.push('');
    } else {
      parts.push(groupShow);
    }
    parts.push(commandName);
    return parts.join(':');
  }
};
