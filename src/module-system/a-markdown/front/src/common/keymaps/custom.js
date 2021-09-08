import { toggleMark } from 'prosemirror-commands';
import { goToNextCell } from 'prosemirror-tables';
import { indentList, outdentList } from './utils.js';

export function buildKeymapCustom(schema, ctx) {
  const keys = [];
  function bind(key, cmd) {
    keys[key] = cmd;
  }
  function save() {
    ctx.$emit('save');
    return true;
  }

  let type;

  // // tab
  // if (schema.nodes.list_item) {
  //   bind('Tab', indentList());
  //   bind('Shift-Tab', outdentList());
  // }

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
  // table
  if (schema.nodes.list_item || schema.nodes.table) {
    const tabTable = goToNextCell(1);
    const shiftTabTable = goToNextCell(-1);
    const tabList = indentList();
    const shiftTabList = outdentList();
    bind('Tab', (state, dispatch, view) => {
      const res = tabTable(state, dispatch, view);
      if (res) return res;
      return tabList(state, dispatch, view);
    });
    bind('Shift-Tab', (state, dispatch, view) => {
      const res = shiftTabTable(state, dispatch, view);
      if (res) return res;
      return shiftTabList(state, dispatch, view);
    });
  }
  // Save
  bind('Mod-s', save);
  bind('Mod-S', save);

  return keys;
}
