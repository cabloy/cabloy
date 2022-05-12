const __categoriesTop = {
  'a-app:appDefault': ['General', 'Management', 'System'],
  'a-appbooster:appSystem': ['BasicProfile', 'BasicAdmin', 'Settings', 'Tools'],
};

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
        appKey,
      });
      return { list: resourcesArrayAll };
    },
    // tools
    data_tools_prepareCategoriesTop() {
      const appKey = this.container.appKey;
      return __categoriesTop[appKey] || [];
    },
    data_tools_groupItems({ categories, items, categoriesTop }) {
      if (!categories || !items) return null;
      // categoriesTop
      if (!categoriesTop) {
        categoriesTop = this.data_tools_prepareCategoriesTop();
      }
      // groups
      let groups = categories.map(item => {
        return {
          id: item.id,
          categoryName: item.categoryName,
          categoryNameLocale: item.categoryNameLocale,
          categorySorting: item.categorySorting,
          items: [],
        };
      });
      // sort
      groups = groups.sort((a, b) => {
        const indexA = categoriesTop.indexOf(a.categoryName);
        const indexB = categoriesTop.indexOf(b.categoryName);
        const sortingA = indexA > -1 ? indexA - categoriesTop.length : a.categorySorting;
        const sortingB = indexB > -1 ? indexB - categoriesTop.length : b.categorySorting;
        return sortingA - sortingB;
      });
      // items
      for (const item of items) {
        const groupId = item.atomCategoryId;
        const group = groups.find(item => item.id === groupId);
        if (group) {
          group.items.push(item);
        }
      }
      // filter
      groups = groups.filter(item => item.items.length > 0);
      // ok
      return groups;
    },
  },
};
