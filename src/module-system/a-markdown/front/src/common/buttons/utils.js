import { MenuItem, wrapItem } from 'prosemirror-menu';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { selectionCell, isInTable } from 'prosemirror-tables';
import { getCellsInColumn } from '@zhennann/prosemirror-utils';

export function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options);
}

export function wrapItemCmd(nodeType, options) {
  const menuItem = wrapItem(nodeType, options);
  return cmdItem(menuItem.spec.run, options);
}

export function cmdItem(cmd, options) {
  const passedOptions = {
    label: options.title,
    run: cmd,
  };
  for (const prop in options) passedOptions[prop] = options[prop];
  // if ((!options.enable || options.enable === true) && !options.select) {
  //   passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state);
  // }
  // not use select
  if (!options.enable || options.enable === true) {
    passedOptions.enable = state => cmd(state);
  }

  return new MenuItem(passedOptions);
}

export function markActive(state, type) {
  const { from, $from, to, empty } = state.selection;
  if (empty) return type.isInSet(state.storedMarks || $from.marks());
  return state.doc.rangeHasMark(from, to, type);
}

export function markItem(markType, options) {
  const passedOptions = {
    active(state) {
      return markActive(state, markType);
    },
    enable: true,
  };
  for (const prop in options) passedOptions[prop] = options[prop];
  return cmdItem(toggleMark(markType), passedOptions);
}

export function canInsert(state, nodeType) {
  const $from = state.selection.$from;
  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);
    if ($from.node(d).canReplaceWith(index, index, nodeType)) return true;
  }
  return false;
}

export function buildMenuItem(ctx, element, key, buttonOptions) {
  if (!buttonOptions) return null;
  const options = {
    ...buttonOptions,
    title: ctx.$text(buttonOptions.title),
    key,
    ctx,
  };
  let menuItem;
  if (buttonOptions.onBuild) {
    // build
    menuItem = buttonOptions.onBuild(element, options);
  } else if (buttonOptions.popup) {
    // popup
    menuItem = buildPopupButton(ctx, element, options);
  }
  return menuItem;
}

export function buttonPopupChildren(ctx, element, options) {
  const menuItems = [];
  for (const buttonOptions of options.children) {
    const menuItem = buildMenuItem(ctx, element, buttonOptions.key, buttonOptions);
    if (menuItem) {
      menuItems.push(menuItem);
    }
  }
  return menuItems;
}

export function buildPopupButton(ctx, element, options) {
  // children
  const menuItems = buttonPopupChildren(ctx, element, options);
  // menuItem
  const menuItem = new MenuItem({
    ...options,
    menuItems,
    run(state, dispatch, view, event) {
      const onPopup = options.onPopup || onPopupPerform;
      onPopup(state, dispatch, view, event, menuItem);
    },
  });
  return menuItem;
}

export async function onPopupPerform(state, dispatch, view, event, menuItemParent) {
  try {
    const { ctx, menuItems } = menuItemParent.spec;
    const buttons = [];
    for (const menuItem of menuItems) {
      buttons.push({
        text: menuItem.spec.title,
        disabled: !menuItem.enabled,
        data: menuItem,
      });
    }
    // choose
    const params = {
      forceToPopover: true,
      targetEl: event.target,
      buttons,
    };
    const button = await ctx.$view.actions.choose(params);
    const menuItem = button.data;
    menuItem.spec.run(state, dispatch, view);
  } catch (err) {}
}

export function insertNode(nodeType, options) {
  return new MenuItem({
    ...options,
    enable(state) {
      return canInsert(state, nodeType);
    },
    run(state, dispatch) {
      dispatch(state.tr.replaceSelectionWith(nodeType.create()));
    },
  });
}

export function extendMenuItem(menuItem, options) {
  return new MenuItem({
    ...menuItem.spec,
    ...options,
  });
}
export function selectionTableCell(state) {
  const cell = selectionCell(state);
  if (!cell) return null;
  return cell.nodeAfter;
}

export function selectionTableRow(state) {
  const cell = selectionCell(state);
  if (!cell) return null;
  const row = cell.parent;
  if (row.type.name !== 'table_row') return null;
  return row;
}

export function selectionTableColumnIndex(state) {
  const cell = selectionTableCell(state);
  const row = selectionTableRow(state);
  if (!cell || !row) return -1;
  let res = -1;
  row.forEach((_cell, _, index) => {
    if (_cell === cell) {
      res = index;
    }
  });
  return res;
}

export function setTableColumnAttr(columnIndex, attrs) {
  return function (state, dispatch) {
    if (!isInTable(state)) return false;
    const cells = getCellsInColumn(columnIndex)(state.selection) || [];
    let transaction = state.tr;
    cells.forEach(({ pos }) => {
      transaction = transaction.setNodeMarkup(pos, null, attrs);
    });
    return dispatch(transaction);
  };
}

export function isInList(state) {
  const $head = state.selection.$head;
  for (let d = $head.depth; d > 0; d--) {
    if (['ordered_list', 'bullet_list'].includes($head.node(d).type.name)) {
      return true;
    }
  }

  return false;
}
