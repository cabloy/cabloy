export default {
  methods: {
    async _onActionCreate() {
      let { ctx, action, item } = this.$props;
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // dataOptions
      let dataOptions = action.dataOptions || {};
      // create params
      let params;
      if (dataOptions.createContinue) {
        params = dataOptions.createParams;
      } else {
        params = await this._onActionCreatePrepareParams({ atomClass, dataOptions, item });
        if (!params) {
          // do nothing
          return;
        }
      }
      // createDelay
      if (action.createDelay && !dataOptions.createContinue) {
        // write
        dataOptions = { ...dataOptions, createDelay: true, createParams: params };
        return await this._onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item });
      }
      // create
      let key;
      if (action.createDelay && dataOptions.createContinue) {
        key = { atomId: item.atomId, itemId: item.itemId };
      } else {
        const resCreate = await ctx.$api.post('/a/base/atom/create', params);
        key = resCreate.key;
        item = resCreate.item;
      }
      // event
      ctx.$meta.eventHub.$emit('atom:action', { key, atomClass, action, atom: item });
      // menu
      if (!dataOptions.noActionWrite) {
        // write
        const itemWrite = ctx.$utils.extend({}, item, key);
        return await this._onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item: itemWrite });
      }
      // just return key
      return key;
    },
    async _onActionCreateContinueWrite({ ctx, action, atomClass, dataOptions, item }) {
      const useStoreAtomActions = await ctx.$store.use('a/basestore/atomActions');
      let actionWrite = await useStoreAtomActions.getActionBase({ atomClass, name: 'write' });
      actionWrite = ctx.$utils.extend({}, actionWrite, { navigateOptions: action.navigateOptions }, { dataOptions });
      return await ctx.$meta.util.performAction({ ctx, action: actionWrite, item });
    },
    async _onActionCreatePrepareParams({ atomClass, dataOptions, item }) {
      // params
      const params = {
        atomClass,
        item,
        options: {
          returnItem: true,
        },
      };
      // roleIdOwner: ignore roleIdOwner===undefined
      const roleIdOwner = await this.base_prepareRoleIdOwner({ params, atomClass });
      if (roleIdOwner === null) return null;
      // options
      this.base_prepareOptionsFromDataOptions(params.options, dataOptions);
      // ok
      return params;
    },
  },
};
