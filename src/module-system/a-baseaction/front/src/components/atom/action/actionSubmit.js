export default {
  methods: {
    async _onActionSubmit() {
      const { ctx, item } = this.$props;
      // onActionSubmitBefore
      //   ctx maybe not layoutManager
      if (ctx.layout && ctx.layout.instanceExtend && ctx.layout.instanceExtend.onActionSubmitBefore) {
        await ctx.layout.instanceExtend.onActionSubmitBefore(this.$props);
      }
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // step one: write
      const options = {
        saveDraftOnly: false,
      };
      await ctx.$api.post('/a/base/atom/write', { key, atomClass, item, options });
      // step middle: confirm
      await ctx.$view.dialog.confirm(this.$text('AtomActionSubmitConfirm'));
      // step two: submit
      const data = await ctx.$api.post('/a/base/atom/submit', { key, atomClass });
      if (data.formal) {
        // delete draft
        if (item.atomStage === 0) {
          ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'delete' } });
          if (item.atomIdFormal > 0) {
            // update formal
            ctx.$meta.eventHub.$emit('atom:action', {
              key: data.formal.key,
              atomClass,
              action: { name: 'save' },
              actionSource: ctx,
            });
          } else {
            // list create
            ctx.$meta.eventHub.$emit('atom:action', {
              key: data.formal.key,
              atomClass,
              action: { name: 'create' },
              atom: data.formal.atom,
            });
          }
        } else {
          // update formal
          ctx.$meta.eventHub.$emit('atom:action', {
            key: data.formal.key,
            atomClass,
            action: { name: 'save' },
            actionSource: ctx,
          });
        }
        // back
        if (!data.flow) {
          ctx.page_setDirty(false); // should before navigate
          ctx.$f7router.back();
        }
      }
      // check if flow
      if (data.flow) {
        // flow
        const flow = data.flow;
        // update draft
        ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action: { name: 'save' }, actionSource: ctx });
        // navigate replace self
        ctx.page_setDirty(false); // should before navigate
        const url = `/a/flowtask/flow?flowId=${flow.id}`;
        ctx.$view.navigate(url, {
          target: '_self',
          reloadCurrent: true,
        });
      }
    },
  },
};
