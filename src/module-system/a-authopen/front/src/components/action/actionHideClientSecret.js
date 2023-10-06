export default {
  methods: {
    async _onActionHideClientSecret() {
      const { ctx, item } = this.$props;
      // confirm
      await this.base_handleConfirm();
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      await ctx.$api.post('/a/authopen/authOpen/hideClientSecret', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' } });
    },
  },
};
