// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAppMineLayoutBlockListMineBodyBase =
    Vue.prototype.$meta.module.get('a-user').options.mixins.ebAppMineLayoutBlockListMineBodyBase;
  return {
    mixins: [ebAppMineLayoutBlockListMineBodyBase],
    data() {
      return {};
    },
    methods: {},
  };
}
