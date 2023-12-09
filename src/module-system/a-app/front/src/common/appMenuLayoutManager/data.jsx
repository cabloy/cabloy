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
      const __appKeyDefault = this.$config.appKey.default;
      const appKey = this.container.appKey;
      // app default
      if (appKey === __appKeyDefault) {
        return await this.data_provider_onLoadItemsAll_appDefault();
      }
      // app other
      return await this.data_provider_onLoadItemsAll_appOther({ appKey });
    },
    async data_provider_onLoadItemsAll_appDefault() {
      const useStoreApp = await this.$store.use('a/app/app');
      // list
      const list = await useStoreApp.getAppItemsAll();
      // check appUnclassified/appGeneral
      for (const appName of ['unclassified', 'general']) {
        const appKey = this.$config.appKey[appName];
        const index = list.findIndex(item => item.atomStaticKey === appKey);
        if (index > -1) {
          const res = await this.data_provider_onLoadItemsAll_appOther({ appKey });
          if (res.list.length === 0) {
            // remove app
            list.splice(index, 1);
          }
        }
      }
      // ok
      return { list };
    },
    async data_provider_onLoadItemsAll_appOther({ appKey }) {
      const resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: 'a-base:menu',
        appKey,
      });
      return { list: resourcesArrayAll };
    },
    // tools
    data_tools_prepareCategoriesTop() {
      const __categoriesTop = this.$config.appMenu.categoriesTop;
      const appKey = this.container.appKey;
      return __categoriesTop[appKey];
    },
  },
};
