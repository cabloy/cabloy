export default {
  methods: {
    async _onActionMoveUp() {
      const { ctx, action, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      const key = { atomId: item.atomId, itemId: item.itemId };
      const result = await ctx.$api.post('/a/base/atom/moveUp', {
        key,
        atomClass,
      });
      ctx.$meta.eventHub.$emit('atom:action', {
        key,
        atomClass,
        action,
        result,
      });
    },
  },
};
