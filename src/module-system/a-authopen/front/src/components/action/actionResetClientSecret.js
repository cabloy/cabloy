export default {
  methods: {
    async _onActionResetClientSecret() {
      const { ctx, item } = this.$props;
      // hide
      await ctx.$view.dialog.confirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      await ctx.$api.post('/a/authopen/authOpen/resetClientSecret', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' } });
    },
  },
};
