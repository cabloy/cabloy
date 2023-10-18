export default {
  methods: {
    async _onActionSave() {
      const { ctx, action, item } = this.$props;
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
      // onActionSaveBefore: should after createDelay
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionSaveBefore) {
        await ctx.layout.instanceExtend.onActionSaveBefore(this.$props);
      }
      // options
      const options = {};
      if (!atomClassBase.itemOnly && item.atomStage === 0) {
        options.saveDraftOnly = true;
      }
      if (dataOptions.flowTaskId) {
        options.flowTaskId = dataOptions.flowTaskId;
      }
      if (dataOptions.formAction) {
        options.formAction = dataOptions.formAction;
      }
      if (dataOptions.formActionMain) {
        options.formActionMain = dataOptions.formActionMain;
      }
      // write
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, actionSource: ctx });
      // toast
      this.base_handleToast();
      // return item
      return item;
    },
  },
};
