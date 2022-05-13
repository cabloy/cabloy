// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAppMenuLayoutBlockListItemsBase =
    Vue.prototype.$meta.module.get('a-app').options.mixins.ebAppMenuLayoutBlockListItemsBase;
  return {
    mixins: [ebAppMenuLayoutBlockListItemsBase],
    data() {
      return {
        settingsInstance: null,
      };
    },
    methods: {
      async onInit() {
        // fetch
        const res = await this.$api.post('/a/settings/settings/instance/list');
        this.settingsInstance = res.list;
        console.log(res.list);
      },
    },
  };
}
