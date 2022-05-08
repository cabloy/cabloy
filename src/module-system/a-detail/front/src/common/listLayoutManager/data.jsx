export default {
  data() {
    return {
      data: {
        provider: {
          key: 'detailId',
        },
      },
    };
  },
  methods: {
    async data_adapter_onProviderSwitch() {
      // do nothing
    },
    data_provider_onItemsClear() {
      // do nothing
    },
    data_provider_onPageCurrentChanged() {
      // do nothing
    },
    async data_provider_onLoadItemsAll() {
      const params = this.base_prepareSelectParams();
      return await this.$api.post('/a/detail/detail/select', params);
    },
  },
};
