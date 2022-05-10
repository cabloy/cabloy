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
      return await this.$api.post('/a/base/resource/select', {
        atomClass: this.base_atomClassApp,
        options: {
          orders: [
            ['f.appSorting', 'asc'],
            ['f.createdAt', 'asc'],
          ],
        },
      });
    },
    // appmenu
    async data_provider_onLoadItemsPage({ page }) {
      const params = this.base_prepareSelectParams();
      params.options.page = page;
      return await this.$api.post('/a/socketio/message/select', params);
    },
  },
};
