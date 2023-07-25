export default {
  created() {
    this.$meta.eventHub.$on('detail:action', this.event_onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('detail:action', this.event_onActionChanged);
  },
  methods: {
    async event_onActionChanged(data) {
      const { atomKey, detailClass } = data;
      if (
        atomKey.atomId !== this.container.atomId ||
        detailClass.module !== this.container.detailClass.module ||
        detailClass.detailClassName !== this.container.detailClass.detailClassName
      ) {
        return;
      }
      // check if changed
      const changed = await this.event_onActionChanged2(data);
      if (changed) {
        // details:change
        this.$meta.eventHub.$emit('details:change', {
          ...data,
          details: this.data_getItemsAll(),
        });
      }
    },
    async event_onActionChanged2(data) {
      let res = false;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        const res2 = await this.event_onActionChanged2_provider(data, provider);
        if (res2) {
          // changed
          res = res2;
        }
      });
      return res;
    },
    async event_onActionChanged2_provider(data, provider) {
      const { key, action, result } = data;
      // create
      if (action.name === 'create') {
        // load
        await this.data.adapter._callMethodProvider(provider, 'onPageRefresh');
        return true;
      }
      // move
      if (action.name === 'moveUp' || action.name === 'moveDown') {
        if (!result) return false;
        const a = action.name === 'moveUp' ? result.to : result.from;
        const b = action.name === 'moveUp' ? result.from : result.to;
        const findA = this.data.adapter.findItemProvier(provider, a);
        const items = findA.items;
        const aIndex = findA.index;
        const findB = this.data.adapter.findItemProvier(provider, b);
        const bIndex = findB.index;
        if (aIndex === -1 || bIndex === -1) {
          // load
          this.data.adapter._callMethodProvider(provider, 'onPageRefresh');
          return false; // not changed
        }
        const row = this.data.adapter._callMethodProvider(provider, 'spliceItem', { items, index: bIndex });
        this.data.adapter._callMethodProvider(provider, 'spliceItem', { items, index: aIndex }, 0, row[0]);
        return false; // not changed
      }
      // findItem
      const { items, index } = this.data.adapter.findItemProvier(provider, key.detailId);
      if (index === -1) return false;
      // delete
      if (action.name === 'delete') {
        this.data.adapter._callMethodProvider(provider, 'spliceItem', { items, index });
        return true;
      }
      // others
      const options = this.base_prepareReadOptions();
      const detailNew = await this.$api.post('/a/detail/detail/read', {
        flowTaskId: this.container.flowTaskId,
        key,
        options,
      });
      this.$set(items, index, detailNew);
      return true;
    },
  },
};
