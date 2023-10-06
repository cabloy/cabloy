export default {
  methods: {
    async _onAction<%=argv.actionNameCapitalize%>() {
      const { ctx, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // confirm
      await this.base_handleConfirm();
      const result = await ctx.$api.post('/<%=argv.moduleInfo.url%>/<%=argv.atomClassName%>/<%=argv.actionName%>', { key });
      if (result) {
        // changed
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' } });
      }
      return result;
    },
  },
};
