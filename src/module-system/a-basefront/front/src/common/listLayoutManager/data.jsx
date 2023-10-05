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
      const res = await this.$api.post('/a/base/atom/select', params);
      this.bulk_patchSelectedAtoms({ items: res.list });
      return res;
    },
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.base_prepareSelectParams();
      params.options.page = page;
      const res = await this.$api.post('/a/base/atom/select', params);
      this.bulk_patchSelectedAtoms({ items: res.list });
      return res;
    },
    async data_provider_onLoadItemsCount() {
      const params = this.base_prepareSelectParams();
      return await this.$api.post('/a/base/atom/count', params);
    },
    async data_provider_onLoadItem({ itemKey }) {
      const options = this.base_prepareReadOptions();
      const atomClass = this.container.atomClass;
      const res = await this.$api.post('/a/base/atom/read', {
        key: { atomId: itemKey },
        atomClass,
        options,
      });
      this.bulk_patchSelectedAtoms({ item: res });
      return res;
    },
  },
};
