// eslint-disable-next-line
export default function (Vue) {
  function _parseIcon({ icon }) {
    // support backend api static
    if (icon.indexOf('/api/static/') === 0) {
      return Vue.prototype.$meta.util.combineFetchStaticPath(icon);
    }
  }
  return {
    state: {
      icons: {},
    },
    getters: {},
    mutations: {},
    actions: {
      async getIcon({ state, commit }, { icon }) {
        if (!icon) return null;
        if (state.icons[icon]) return state.icons[icon];
        // support backend api static
        const iconHref = _parseIcon({ icon });
        commit('setIcon', { icon, iconHref });
        return iconHref;
      },
    },
  };
}
