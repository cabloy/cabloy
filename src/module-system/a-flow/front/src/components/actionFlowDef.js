export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      const key = { atomId: item.atomId, itemId: item.itemId };
      if (action.name === 'enable') {
        return await this._enable({ ctx, key });
      } else if (action.name === 'disable') {
        return await this._disable({ ctx, key });
      }
    },
    async _enable({ ctx, key }) {
      await ctx.$api.post('/a/flow/flowDef/enable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
    async _disable({ ctx, key }) {
      await ctx.$api.post('/a/flow/flowDef/disable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
  },
};
