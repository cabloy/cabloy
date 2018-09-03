import menus from './components/menu/list.vue';
import atoms from './components/atom/list.vue';
import item from './components/atom/item.vue';
import action from './components/atom/action.js';
import actions from './common/actions.js';
import atomClasses from './common/atomClasses.js';
import modules from './common/modules.js';

export default {
  menus,
  item,
  action,
  ebAtoms: atoms,
  ebActions: actions,
  ebAtomClasses: atomClasses,
  ebModules: modules,
};
