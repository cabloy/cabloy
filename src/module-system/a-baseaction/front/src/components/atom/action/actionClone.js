export default {
  methods: {
    async _onActionClone() {
      const { ctx, action, item } = this.$props;
      // confirm
      // await this.base_handleConfirm();
      try {
        // key
        const key = { atomId: item.atomId, itemId: item.itemId };
        // atomClass
        const atomClass = {
          module: item.module,
          atomClassName: item.atomClassName,
        };
        // dataOptions
        const dataOptions = action.dataOptions || {};
        // params
        const params = {
          key,
          atomClass,
          options: {},
        };
        // roleIdOwner: ignore roleIdOwner===undefined
        const roleIdOwner = await this.base_prepareRoleIdOwner({ params, atomClass });
        if (roleIdOwner === null) return null;
        // options
        this.base_prepareOptionsFromDataOptions(params.options, dataOptions);
        // clone
        const data = await ctx.$api.post('/a/base/atom/clone', params);
        const dataRes = data.draft || data.formal;
        const keyDraft = dataRes.key;
        const atomDraft = dataRes.atom;
        // event
        ctx.$meta.eventHub.$emit('atom:action', {
          key: keyDraft,
          atomClass,
          action: { name: 'create' },
          atom: atomDraft,
        });
        // queries
        const queries = {
          mode: 'edit',
          atomId: atomDraft.atomId,
          itemId: atomDraft.itemId,
          ...atomClass,
        };
        this.base_prepareOptionsFromDataOptions(queries, dataOptions);
        // url
        const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
        // open
        let navigateOptions = action.navigateOptions;
        if (ctx.index?.layoutManagerScene === 'item') {
          navigateOptions = { target: '_self' };
        }
        navigateOptions = Object.assign({}, navigateOptions, {
          context: {
            params: { atomMain: dataOptions.atomMain },
          },
        });
        ctx.$view.navigate(url, navigateOptions);
      } catch (err) {
        if (err.code === 422) {
          throw new Error(err.message[0].message);
        }
        throw err;
      }
    },
  },
};
