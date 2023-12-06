// eslint-disable-next-line
export default function (Vue) {
  return {
    state: {
      // global
      layoutItems: {},
    },
    getters: {},
    mutations: {
      setLayoutItem(state, { layoutKey, layoutItem }) {
        state.layoutItems = {
          ...state.layoutItems,
          [layoutKey]: layoutItem,
        };
      },
    },
    actions: {
      async getLayoutItem({ state, commit }, { layoutKey }) {
        let layoutItem = state.layoutItems[layoutKey];
        if (layoutItem) return layoutItem;
        layoutItem = await __fetchLayoutItem({ Vue, layoutKey });
        if (!layoutItem) return null; // maybe no access right
        // content
        layoutItem.content = layoutItem.content ? JSON.parse(layoutItem.content) : null;
        // layoutKey
        if (layoutItem.content) {
          layoutItem.content.layoutKey = layoutKey;
        }
        // use module
        const parts = layoutKey.split(':');
        if (parts.length === 2) {
          await Vue.prototype.$meta.module.use(parts[0]);
        }
        // ok
        commit('setLayoutItem', { layoutKey, layoutItem });
        return layoutItem;
      },
    },
  };
}

async function __fetchLayoutItem({ Vue, layoutKey }) {
  try {
    const layoutItem = await Vue.prototype.$meta.api.post('/a/base/resource/read', {
      atomStaticKey: layoutKey,
      options: {
        locale: false,
      },
    });
    return layoutItem;
  } catch (err) {
    if (err.code === 401 || err.code === 403) {
      return null;
    }
    throw err;
  }
}
