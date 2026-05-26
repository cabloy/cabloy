import { BeanCliBase, getCommandsMeta } from '@cabloy/cli';

declare module '@cabloy/cli' {
  export interface ICommandArgv {
    set?: string;
    group?: string;
  }
}

export class CliDefaultList extends BeanCliBase {
  async execute() {
    const { argv } = this.context;
    // super
    await super.execute();
    // set/group
    const setWant = argv.set;
    let groupWant = argv.group;
    if (!setWant) groupWant = undefined;
    // commandsAll
    const commandsAll = (await getCommandsMeta()).all;
    // setsShow
    let setsShow;
    if (setWant) {
      if (!commandsAll[setWant]) throw new Error(`cli set not found: ${setWant}`);
      setsShow = [setWant];
    } else {
      setsShow = Object.keys(commandsAll);
    }
    // loop
    const total = setsShow.length;
    for (let index = 0; index < total; index++) {
      const setShow = setsShow[index];
      // log
      await this.console.log({
        total,
        progress: index,
        text: setShow,
      });
      // show
      await this._setShow({ setShow, groupWant, commandsAll });
    }
    // await this.console.log({ text: JSON.stringify(modulesWant) });
  }

  async _setShow({ setShow, groupWant, commandsAll }: any) {
    // _set
    const _set = commandsAll[setShow];
    // groupsShow
    let groupsShow;
    if (groupWant) {
      if (!_set[groupWant]) throw new Error(`cli set group not found: ${setShow}:${groupWant}`);
      groupsShow = [groupWant];
    } else {
      groupsShow = Object.keys(_set);
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
      const _group = _set[groupShow];
      for (const commandName in _group) {
        const _command = _group[commandName].command;
        const cliFullName = this._combineCliFullName({ setShow, groupShow, commandName });
        const version = _command.info.version;
        const description = _command.info.description || _command.info.title;
        table.push([cliFullName, version, description]);
      }
      if (index < groupCount - 1) {
        table.push([]);
      }
    }
    // log
    await this.console.log({ text: table.toString() });
  }

  _combineCliFullName({ setShow, groupShow, commandName }: any) {
    const parts: any[] = [];
    if (setShow === 'front') {
      parts.push('');
    } else {
      parts.push(setShow);
    }
    if (groupShow === 'default') {
      parts.push('');
    } else {
      parts.push(groupShow);
    }
    parts.push(commandName);
    return parts.join(':');
  }
}
