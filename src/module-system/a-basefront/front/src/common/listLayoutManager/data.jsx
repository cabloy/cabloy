export default {
  data() {
    return {
      data: {
        provider: {
          itemKey: 'atomId',
          selectedItemsKey: 'selectedAtoms',
          activeItemKey: 'activeAtomKey',
          hoverItemKey: 'hoverAtomKey',
        },
      },
    };
  },
  methods: {
    async data_adapter_onProviderSwitch() {
      // bulk
      this.bulk_closeSelecting();
    },
    data_provider_onItemsClear() {
      // bulk: should not clear selected atoms
      // this.bulk_clearSelectedAtoms();
    },
    data_provider_onPageCurrentChanged() {
      // bulk: should not clear selected atoms
      // this.bulk_clearSelectedAtoms();
    },
    async data_provider_onLoadItemsAll() {
      const params = this.base_prepareSelectParams();
      return await this.$api.post('/a/base/atom/select', params);
    },
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.base_prepareSelectParams();
      params.options.page = page;
      return await this.$api.post('/a/base/atom/select', params);
    },
    async data_provider_onLoadItemsCount() {
      const params = this.base_prepareSelectParams();
      return await this.$api.post('/a/base/atom/count', params);
    },
  },
};
