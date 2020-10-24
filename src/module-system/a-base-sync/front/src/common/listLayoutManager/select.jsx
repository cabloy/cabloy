export default {
  data() {
    return {
    };
  },
  methods: {
    select_getSelectedAtoms() {
      if (this.container.scene === 'selecting') {
        return this.container.params.selectedAtoms;
      }
      if (this.container.scene === 'select') {
        return this.base_getItems();
      }
    },
  },
};
