export default {
  data() {
    return {
      data: {
        provider: {
          key: null,
        },
      },
    };
  },
  methods: {
    async data_provider_onLoadItemsAll() {
      const params = this.base_prepareSelectParams();
      const list = await this.$api.post('/a/message/message/group', params);
      return { list };
    },
  },
};
