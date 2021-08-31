import { buildMenuItem } from './buttons/utils.js';
import { ButtonsDefault, ButtonsAllOptions } from './buttons/constants.js';

export { ButtonsDefault, ButtonsAllOptions };

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
    const menuItem = buildMenuItem(ctx, element, key, buttonOptions);
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
