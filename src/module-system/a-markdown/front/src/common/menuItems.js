import { wrapItem, blockTypeItem, MenuItem } from 'prosemirror-menu';
import { wrapListItem, markItem, canInsert } from './buttons/utils.js';
import { ButtonsDefault, ButtonsAllOptions } from './buttons/constants.js';

export { ButtonsDefault, ButtonsAllOptions };

function buildPopupButton(ctx, element, options) {
  // children
  const menuItems = [];
  for (const buttonOptions of options.children) {
    const menuItem = __buildMenuItem(ctx, element, buttonOptions.key, buttonOptions);
    if (menuItem) {
      menuItems.push(menuItem);
    }
  }
  const menuItem = new MenuItem({
    ...options,
    menuItems,
    run(state, dispatch, view, event) {
      options.onPopup(state, dispatch, view, event, menuItem);
    },
  });
  return menuItem;
}

async function onPopupPerform(state, dispatch, view, event, menuItemParent) {
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

function __buildMenuItem(ctx, element, key, buttonOptions) {
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

function getMarkNodeElement(schema, key, buttonOptions) {
  if (buttonOptions.mark) {
    return schema.marks[buttonOptions.mark === true ? key : buttonOptions.mark] || false;
  }
  if (buttonOptions.node) {
    return schema.nodes[buttonOptions.node === true ? key : buttonOptions.node] || false;
  }
  return null;
}

function buildMenuItemsAll(ctx, schema) {
  const menuItems = {};
  for (const key in ButtonsAllOptions) {
    const buttonOptions = ButtonsAllOptions[key];
    const element = getMarkNodeElement(schema, key, buttonOptions);
    if (element === false) continue;
    const menuItem = __buildMenuItem(ctx, element, key, buttonOptions);
    if (menuItem) {
      menuItems[key] = menuItem;
    }
  }
  // ok
  return menuItems;
}

export function buildMenuItems(ctx, schema, buttonsWant) {
  // menuItemsAll
  const menuItemsAll = buildMenuItemsAll(ctx, schema);
  // menuItems
  let menuItems = buttonsWant.map(buttons => {
    const arr = buttons.map(button => {
      return menuItemsAll[button];
    });
    return arr.filter(x => x);
  });
  menuItems = menuItems.filter(x => x && x.length > 0);
  return menuItems;
}
