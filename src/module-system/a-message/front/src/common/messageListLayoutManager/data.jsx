export default {
  data() {
    return {
      data: {
        provider: {
          key: 'id',
        },
      },
    };
  },
  methods: {
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.base_prepareSelectParams();
      params.options.page = page;
      return await this.$api.post('/a/socketio/message/select', params);
    },
  },
};
