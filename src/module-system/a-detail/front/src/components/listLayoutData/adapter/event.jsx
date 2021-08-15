export default {
  created() {
    this.$meta.eventHub.$on('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.event_onActionsChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.event_onActionsChanged);
  },
  methods: {
    event_onActionChanged(data) {
      const key = data.key;
      const action = data.action;
      // create
      if (action.name === 'create') {
        // do nothing
        return;
      }
      // loop
      this._loopProviders(async provider => {
        // findItem
        const res = this._callMethodProvider(provider, 'findItem', key.atomId);
        if (!res) return;
        const { items, index } = res;
        if (index === -1) return;
        if (action.name === 'delete') {
          this._callMethodProvider(provider, 'spliceItem', items, index);
          return;
        }
        // other actions
        // fetch new atom
        const options = this.layoutManager.base_prepareReadOptions();
        const atomNew = await this.$api.post('/a/base/atom/read', {
          key,
          options,
        });
        this.$set(items, index, atomNew);
      });
    },
    event_onActionsChanged(data) {
      const key = data.key;
      // loop
      this._loopProviders(async provider => {
        // findItem
        const res = this._callMethodProvider(provider, 'findItem', key.atomId);
        if (!res) return;
        const { items, index } = res;
        if (index === -1) return;
        this.$set(items[index], '_actions', null);
      });
    },
  },
};
