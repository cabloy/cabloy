// eslint-disable-next-line
export default function (Vue) {
  async function _parseIcon({ icon }) {
    // support backend api static
    if (icon.indexOf('/api/static/') === 0) {
      return Vue.prototype.$meta.util.combineFetchStaticPath(icon);
    }
    // split module:group:name
    const parts = icon.split(':');
    const moduleName = parts[0] || 'a-iconbooster';
    const group = parts[1] || 'default';
    const name = parts[2] || '';
    // load module
    const module = await Vue.prototype.$meta.module.use(moduleName);
    // group
    const groupHref = module.options.icons[group];
    // combine
    return `${groupHref}#${name}`;
  }
  return {
    state: {
      icons: {},
    },
    getters: {},
    mutations: {
      setIcon(state, { icon, iconHref }) {
        state.icons = {
          ...state.icons,
          [icon]: iconHref,
        };
      },
    },
    actions: {
      async getIcon({ state, commit }, { icon }) {
        if (!icon) return null;
        if (state.icons[icon]) return state.icons[icon];
        // support backend api static
        const iconHref = await _parseIcon({ icon });
        commit('setIcon', { icon, iconHref });
        return iconHref;
      },
    },
  };
}
