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
      const current = this.base_appCurrent;
      const resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: 'a-base:mine',
        appKey: current.appKey,
      });
      return { list: resourcesArrayAll };
    },
    // tools
    data_tools_prepareCategoriesTop() {
      const current = this.base_appCurrent;
      const __categoriesTop = this.$config.appMine.categoriesTop;
      const appKey = current.appKey;
      return __categoriesTop[appKey];
    },
  },
};
