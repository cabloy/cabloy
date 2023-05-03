export default {
  methods: {
    async _onActionWrite() {
      const { ctx, action, item } = this.$props;
      const key = { atomId: item.atomId, itemId: item.itemId };
      // atomClass
      const atomClass = {
        module: item.module,
        atomClassName: item.atomClassName,
      };
      // atomClassBase
      const atomClassBase = await ctx.$store.dispatch('a/base/getAtomClassBase', { atomClass });
      // dataOptions
      const dataOptions = action.dataOptions || {};
      if (dataOptions.createDelay) {
        // create delay
        await this._onActionWrite_createDelay({ ctx, action, item, atomClass, dataOptions });
      } else {
        // general
        if (atomClassBase.itemOnly) {
          await this._onActionWrite_itemOnly({ ctx, action, key, atomClass });
        } else {
          await this._onActionWrite_normal({ ctx, action, key, atomClass });
        }
      }
    },
    async _onActionWrite_createDelay({ ctx, action, item, atomClass, dataOptions }) {
      // params
      const params = {
        createDelay: {
          item,
          dataOptions,
        },
      };
      // queries
      const queries = {
        mode: 'edit',
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
        params: JSON.stringify(params),
      };
      // navigate
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      ctx.$view.navigate(url, action.navigateOptions);
    },
    async _onActionWrite_itemOnly({ ctx, action, key, atomClass }) {
      // queries
      const queries = {
        mode: 'edit',
        atomId: key.atomId,
        itemId: key.atomId,
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
      // navigate
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      ctx.$view.navigate(url, action.navigateOptions);
    },
    async _onActionWrite_normal({ ctx, action, key, atomClass }) {
      // openDraft
      const data = await ctx.$api.post('/a/base/atom/openDraft', { key, atomClass });
      const dataRes = data.draft || data.formal;
      const keyWrite = dataRes.key;
      const atomWrite = dataRes.atom;
      const changed = data.changed;
      // emit
      if (changed) {
        ctx.$meta.eventHub.$emit('atom:action', {
          key: keyWrite,
          atomClass,
          action: { name: 'create' },
          atom: atomWrite,
        });
      }
      // queries
      const queries = {
        mode: 'edit',
        atomId: atomWrite.atomId,
        itemId: atomWrite.itemId,
        module: atomClass.module,
        atomClassName: atomClass.atomClassName,
      };
      // navigate
      const url = ctx.$meta.util.combineQueries('/a/basefront/atom/item', queries);
      ctx.$view.navigate(url, action.navigateOptions);
      // event: neednot check atomStage
      // if (item.atomStage > 0) {
      //   ctx.$meta.eventHub.$emit('atom:actions', { key, atomClass });
      // }
      if (changed) {
        ctx.$meta.eventHub.$emit('atom:actions', { key, atomClass });
      }
    },
  },
};
