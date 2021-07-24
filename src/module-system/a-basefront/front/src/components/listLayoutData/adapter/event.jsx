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
      if (action.menu === 1 && action.action === 'create') {
        // do nothing
        return;
      }
      // delete
      const { items, index } = this.findItem(key.atomId);
      if (action.name === 'delete') {
        if (index !== -1) {
          this.spliceItem(items, index);
        }
        return;
      }
      // others
      if (index !== -1) {
        const options = this.layoutManager.base_prepareReadOptions();
        this.$api
          .post('/a/base/atom/read', {
            key,
            options,
          })
          .then(data => {
            this.$set(items, index, data);
          });
      }
    },
    event_onActionsChanged(data) {
      const key = data.key;
      const { items, index } = this.findItem(key.atomId);
      if (index !== -1) {
        this.$set(items[index], '_actions', null);
      }
    },
  },
};
