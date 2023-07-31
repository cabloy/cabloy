export default {
  methods: {
    async _onActionDelete() {
      const { ctx, action, item } = this.$props;
      // delete
      await ctx.$view.dialog.confirm();
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
      // atomClass
      const atomClass = { module: item.module, atomClassName: item.atomClassName };
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // options
      const options = {};
      if (dataOptions.flowTaskId) {
        options.flowTaskId = dataOptions.flowTaskId;
      }
      // post
      await ctx.$api.post('/a/base/atom/delete', {
        key,
        atomClass,
        options,
      });
      ctx.$meta.eventHub.$emit('atom:action', {
        key,
        atomClass,
        action,
      });
      // update formal
      if (item.atomStage === 0 && item.atomIdFormal) {
        ctx.$meta.eventHub.$emit('atom:action', {
          key: { atomId: item.atomIdFormal },
          atomClass,
          action: { name: 'save' },
        });
      }
      // back
      if (ctx.index?.layoutManagerScene === 'item') {
        ctx.$f7router.back();
      }
    },
  },
};
