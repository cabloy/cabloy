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
        const list = await this.$store.dispatch('a/app/getAppItemsAll');
        return { list };
      }
      // app other
      const resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: 'a-base:menu',
      });
      const treeData = await this.$store.dispatch('a/base/getCategoryTreeResource', {
        resourceType: 'a-base:menu',
      });
      console.log(resourcesArrayAll);
      console.log(treeData);
    },
  },
};
