export default {
  data() {
    return {
      bulk: {
        actions: null,
        selectedAtoms: [],
        selecting: false,
      },
    };
  },
  methods: {
    bulk_loadActions() {
      if (this.bulk.actions) return;
      this.$api.post('/a/base/atom/actionsBulk', {
        atomClass: this.container.atomClass,
      }).then(data => {
        this.bulk.actions = data;
      });
    },
    bulk_onSelectingSwitch() {
      this.bulk.selecting = !this.bulk.selecting;
      if (!this.bulk.selecting) {
        this.bulk.selectedAtoms = [];
      }
    },
    bulk_onItemChange(event, item) {
      const selectedAtoms = this.bulk.selectedAtoms;
      const index = selectedAtoms.findIndex(_item => _item.atomId === item.atomId);
      if (event.target.checked && index === -1) {
        selectedAtoms.push(item);
      } else if (!event.target.checked && index > -1) {
        selectedAtoms.splice(index, 1);
      }
    },
    bulk_onSelectingChecking() {
      const items = this.base_getItems();
      const selectedAtoms = this.bulk.selectedAtoms;
      if (selectedAtoms.length >= items.length) {
        // uncheck all
        this.bulk.selectedAtoms = [];
      } else {
        // check all
        this.bulk.selectedAtoms = items.concat();
      }
    },
  },
};
