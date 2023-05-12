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
      const useStoreAtomClasses = await ctx.$store.use('a/base/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
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
      // write
      const key = { atomId: item.atomId, itemId: item.itemId };
      await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, actionSource: ctx });
      // toast
      return ctx.$text('Saved');
    },
  },
};
