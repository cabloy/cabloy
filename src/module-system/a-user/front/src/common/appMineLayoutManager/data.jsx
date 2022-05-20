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
      const resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: 'a-base:mine',
        appKey: this.base.appInfoCurrent.appKey,
      });
      return { list: resourcesArrayAll };
    },
    // tools
    data_tools_prepareCategoriesTop() {
      const __categoriesTop = this.$config.appMine.categoriesTop;
      const appKey = this.base.appInfoCurrent.appKey;
      return __categoriesTop[appKey];
    },
  },
};
