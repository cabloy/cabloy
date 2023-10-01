export default {
  methods: {
    async _onActionPerformAction() {
      const { ctx, action, item } = this.$props;
      const actionParams = action.params || {};
      // confirm
      if (actionParams.confirm) {
        await ctx.$view.dialog.confirm();
        return;
      }
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // atomClassBase
      const useStoreAtomClasses = await ctx.$store.use('a/basestore/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
      // dataOptions
      const dataOptions = action.dataOptions || {};
      // onActionPerformActionBefore: should after form
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionPerformActionBefore) {
        await ctx.layout.instanceExtend.onActionPerformActionBefore(this.$props);
      }
      // options
      const options = {};
      // flowTaskId
      if (dataOptions.flowTaskId) {
        options.flowTaskId = dataOptions.flowTaskId;
      }
      // write
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, actionSource: ctx });
      // toast
      return ctx.$text('Saved');
    },
  },
};
