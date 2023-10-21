export default {
  methods: {
    async _onActionMoveDown() {
      const { ctx, action, item } = this.$props;
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // options
      const options = {};
      this.base_prepareOptionsFromDataOptions(options, dataOptions);
      // post
      const result = await ctx.$api.post('/a/base/atom/moveDown', {
        key,
        atomClass,
        options,
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
