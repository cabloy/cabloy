import { indentList, outdentList } from './utils.js';

export function buildKeymapTabs(schema) {
  const keys = [];
  function bind(key, cmd) {
    keys[key] = cmd;
  }

  if (schema.nodes.list_item) {
    bind('Tab', indentList());
    bind('Shift-Tab', outdentList());
  }
  return keys;
}
