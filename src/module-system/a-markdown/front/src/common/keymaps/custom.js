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
  // strikethrough
  if ((type = schema.marks.strikethrough)) {
    bind('Mod-Shift-x', toggleMark(type));
    bind('Mod-Shift-X', toggleMark(type));
  }
  // mark
  if ((type = schema.marks.mark)) {
    bind('Mod-Shift-h', toggleMark(type));
    bind('Mod-Shift-H', toggleMark(type));
  }
  // sup
  if ((type = schema.marks.sup)) {
    bind('Mod-.', toggleMark(type));
  }
  // sub
  if ((type = schema.marks.sub)) {
    bind('Mod-,', toggleMark(type));
  }

  return keys;
}
