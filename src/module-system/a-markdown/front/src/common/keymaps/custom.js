import { toggleMark } from 'prosemirror-commands';
import { indentList, outdentList } from './utils.js';

export function buildKeymapCustom(schema) {
  const keys = [];
  function bind(key, cmd) {
    keys[key] = cmd;
  }

  let type;

  // tab
  if (schema.nodes.list_item) {
    bind('Tab', indentList());
    bind('Shift-Tab', outdentList());
  }

  // underline
  if ((type = schema.marks.underline)) {
    bind('Mod-u', toggleMark(type));
    bind('Mod-U', toggleMark(type));
  }

  return keys;
}
