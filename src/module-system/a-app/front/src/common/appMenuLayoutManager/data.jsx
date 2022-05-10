export default {
  data() {
    return {
      data: {
        provider: {
          itemKey: 'id',
        },
      },
    };
  },
  methods: {
    // apps
    async data_provider_onLoadItemsAll() {
      const params = this.base_prepareSelectParams();
      const list = await this.$api.post('/a/message/message/group', params);
      return { list };
    },
    // appmenu
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.base_prepareSelectParams();
      params.options.page = page;
      return await this.$api.post('/a/socketio/message/select', params);
    },
  },
};
