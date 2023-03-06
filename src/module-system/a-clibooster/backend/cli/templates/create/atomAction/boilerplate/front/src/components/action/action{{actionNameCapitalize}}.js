export default {
  methods: {
    async _onAction<%=argv.actionNameCapitalize%>() {
      const { ctx, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$view.dialog.confirm();
      const result = await ctx.$api.post('/<%=argv.moduleInfo.url%>/<%=argv.atomClassName%>/<%=argv.actionName%>', { key });
      if (result) {
        // changed
        ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
      }
      return result;
    },
  },
};
