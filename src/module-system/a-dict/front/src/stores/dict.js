export default function (Vue) {
  return {
    state() {
      return {
        dicts: {},
      };
    },
    created() {
      Vue.prototype.$meta.eventHub.$on('auth:login', () => {
        // clear user state
        this.dicts = {};
      });
    },
    actions: {},
  };
}
