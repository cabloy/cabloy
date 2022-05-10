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
  },
};
