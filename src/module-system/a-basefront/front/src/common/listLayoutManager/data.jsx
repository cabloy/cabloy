export default {
  data() {
    return {};
  },
  methods: {
    async data_adapter_onProviderSwitch() {
      // bulk
      this.bulk_closeSelecting();
    },
    async data_provider_onItemsClear() {
      // bulk
      this.bulk_clearSelectedAtoms();
    },
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.layoutManager.base_prepareSelectParams();
      params.options.page = page;
      return await this.$api.post('/a/base/atom/select', params);
    },
  },
};
