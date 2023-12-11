export default function (Vue) {
  return {
    state() {
      return {
        layoutItems: {},
      };
    },
    actions: {
      setLayoutItem({ layoutKey, layoutItem }) {
        this.layoutItems = {
          ...this.layoutItems,
          [layoutKey]: layoutItem,
        };
      },
      async getLayoutItem({ layoutKey }) {
        const layoutItem = await this._getLayoutItem_inner({ layoutKey });
        // debug
        const debug = Vue.prototype.$debug.get('layout');
        debug('layout key: %s, %o', layoutKey, layoutItem?.content);
        return layoutItem;
      },
      async _getLayoutItem_inner({ layoutKey }) {
        let layoutItem = this.layoutItems[layoutKey];
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
        this.setLayoutItem({ layoutKey, layoutItem });
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
