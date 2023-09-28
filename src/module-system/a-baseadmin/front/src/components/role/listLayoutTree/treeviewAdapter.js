import Vue from 'vue';
const ebTreeviewAdapterBase = Vue.prototype.$meta.module.get('a-components').options.mixins.ebTreeviewAdapterBase;

export default function (ctx, { layoutManager }) {
  // roleIdStart
  const roleIdStart = layoutManager.container.roleIdStart || 0;
  // maxLevelAutoOpened
  let maxLevelAutoOpened = layoutManager.container.maxLevelAutoOpened;
  if (maxLevelAutoOpened === undefined) maxLevelAutoOpened = 2;
  // adapter
  return class Adapter extends ebTreeviewAdapterBase(ctx) {
    async onLoadChildren(node) {
      const treeviewData = this.treeviewData;
      //
      const levelCurrent = node.__level || 0;
      const level = levelCurrent + 1;
      //
      let data;
      const roleId = node.root ? roleIdStart : node.id;
      if (roleId === 0) {
        data = await ctx.$api.post('/a/baseadmin/role/childrenTop', { page: { size: 0 } });
      } else {
        data = await ctx.$api.post('/a/baseadmin/role/children', { roleId, page: { size: 0 } });
      }
      const list = [];
      for (const item of data.list) {
        const nodeChild = {
          id: item.id,
          attrs: {
            id: treeviewData._calcNodeAttrId(node, item),
            // label: item.atomNameLocale || item.roleName || `[${ctx.$text('New Role')}]`,
            toggle: item.catalog === 1,
            loadChildren: item.catalog === 1,
            iconF7: item._roleTypeCodeOptions.icon.f7,
          },
          data: item,
          __level: level,
        };
        if (item.catalog === 1 && (level <= maxLevelAutoOpened || maxLevelAutoOpened === -1)) {
          await treeviewData._preloadChildren(nodeChild);
        }
        list.push(nodeChild);
      }
      return list;
    }
    onNodeReplace(node, nodeNew) {
      node.attrs.iconF7 = nodeNew.data._roleTypeCodeOptions.icon.f7;
      super.onNodeReplace(node, nodeNew);
    }
  };
}
