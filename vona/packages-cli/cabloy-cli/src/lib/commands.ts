import { commandsConfig } from '../config.ts';

let __commandsMeta: { map: any; all: any };

export async function getCommandsMeta() {
  await collectCommands();
  return __commandsMeta;
}

export function findCommand(cliFullName: string) {
  return __commandsMeta.map[cliFullName];
}

export async function collectCommands() {
  await _collectCommands();
}

async function _collectCommands() {
  if (__commandsMeta) return;
  const _commandsMap: any = {};
  const _commandsAll: any = {};
  const sets = commandsConfig.sets[process.env.CabloyCliBrandName as any];
  for (const setName in sets) {
    const setModuleName = sets[setName];
    const setModule = await import(setModuleName); // 270ms
    const commands = setModule.commands;
    if (!commands) continue;
    const _commandsSet = (_commandsAll[setName] = {});
    for (const groupName in commands) {
      const group = commands[groupName];
      const _commandsGroup = (_commandsSet[groupName] = {});
      for (const key in group) {
        const command = group[key];
        const fullKey = `${setName}:${groupName}:${key}`;
        // command BeanClass
        const BeanClass = setModule.beans[command.bean];
        // ok
        _commandsMap[fullKey] = _commandsGroup[key] = { command, BeanClass };
      }
    }
  }
  // ok
  __commandsMeta = {
    map: _commandsMap,
    all: _commandsAll,
  };
}
