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
      // saveDraftOnly
      if (!atomClassBase.itemOnly && item.atomStage === 0) {
        options.saveDraftOnly = true;
      }
      // from data options
      this.base_prepareOptionsFromDataOptions(options, dataOptions);
      // write
      let key = { atomId: item.atomId, itemId: item.itemId };
      const isCreateDelay = key.atomId === 0;
      key = await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      // key maybe changed when createDelay
      if (isCreateDelay) {
        item.id = key.itemId;
        item.atomId = key.atomId;
        item.itemId = key.itemId;
      }
      // event: save
      if (!isCreateDelay) {
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, actionSource: ctx });
      }
      // toast
      this.base_handleToast();
      // return item
      return item;
    },
  },
};
