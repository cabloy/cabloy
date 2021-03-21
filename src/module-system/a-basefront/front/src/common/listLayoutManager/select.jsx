export default {
  data() {
    return {
      select: {
        selectedAtoms: [],
      },
    };
  },
  methods: {
    async select_prepareSelectedAtoms() {
      if (this.container.scene !== 'selecting') return;
      // selectedAtoms
      if (this.container.params.selectedAtoms) {
        this.select.selectedAtoms = this.container.params.selectedAtoms;
        return;
      }
      // selectedAtomIds
      const selectedAtomIds = this.container.params.selectedAtomIds;
      if (selectedAtomIds && selectedAtomIds.length > 0) {
        // fetch
        const params = {
          options: {
            where: {
              'a.id': selectedAtomIds,
            },
          },
        };
        const res = await this.$api.post('/a/base/atom/select', params);
        this.select.selectedAtoms = res.list;
        return;
      }
    },
    select_getSelectedAtoms() {
      if (this.container.scene === 'selecting') {
        return this.select.selectedAtoms;
      }
      if (this.container.scene === 'select') {
        return this.base_getItems();
      }
    },
  },
};
