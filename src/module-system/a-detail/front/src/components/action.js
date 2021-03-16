export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate({ ctx, action, item });
      } else if (action.name === 'delete') {

      } else if (action.name === 'save') {

      } else if (action.name === 'write') {
        const url = ctx.$meta.util.replaceTemplate('/a/detail/detail/item?mode=edit&detailId={{detailId}}&detailItemId={{detailItemId}}', item);
        ctx.$view.navigate(url, action.navigateOptions);
      } else if (action.name === 'clone') {

      }
    },
    async _onActionCreate({ ctx, action, item }) {
      // atomKey
      const atomKey = { atomId: item.atomId };
      // create
      const key = await ctx.$api.post('/a/detail/detail/create', {
        atomKey,
        detailClass: {
          module: item.module,
          detailClassName: item.detailClassName,
        },
        item,
      });
      // event
      ctx.$meta.eventHub.$emit('detail:action', { atomKey, key, action });
      // menu
      if (action.menu === 1 || (action.actionComponent || action.actionPath)) {
        item = ctx.$utils.extend({}, item, key);
        // write
        const actionsAll = await ctx.$store.dispatch('a/base/getDetailActions');
        let actionWrite = actionsAll[item.module][item.detailClassName].write;
        actionWrite = ctx.$utils.extend({}, actionWrite);
        await ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
      }
      // just return key
      return key;
    },
  },
};
