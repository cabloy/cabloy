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
      const list = await this.$store.dispatch('a/app/getAppItemsAll');
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
