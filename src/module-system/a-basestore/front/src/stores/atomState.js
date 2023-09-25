export default function (Vue) {
  function __combineKey({ atomClass, atomStage }) {
    return `${atomClass.module}:${atomClass.atomClassName}:${atomStage}`;
  }

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
    actions: {
      setDict({ atomClass, atomStage, dict }) {
        const useAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useAtomStage.toString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        this.dicts[key] = dict;
      },
      async getDict({ atomClass, atomStage }) {
        const useAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useAtomStage.toString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        // dict maybe null
        if (this.dicts[key] !== undefined) return this.dicts[key];
        const dict = await this._getDict({ atomClass, atomStage });
        this.setDict({ atomClass, atomStage, dict });
        return dict;
      },
      async findItem({ dictKey, code, options }) {
        if (_checkIfEmptyForSelect(code)) return null;
        code = String(code);
        // options
        options = options || { separator: '/' };
        const separator = options.separator;
        // dict
        const dict = await this.getDict({ dictKey });
        if (!dict._cache) dict._cache = {};
        let dictItemRes = dict._cache[code];
        if (dictItemRes) return dictItemRes;
        // find
        const dictItemsRes = [];
        const res = _findItem_loop({
          dictItemsRes,
          dictItemsMap: dict._dictItemsMap,
          codes: code.split('/'),
        });
        if (!res) return null;
        const titleFull = dictItemsRes.map(item => item.title).join(separator);
        const titleLocaleFull = dictItemsRes.map(item => item.titleLocale).join(separator);
        dictItemRes = {
          ...dictItemsRes[dictItemsRes.length - 1],
          codeFull: code,
          titleFull,
          titleLocaleFull,
        };
        // cache
        dict._cache[code] = dictItemRes;
        // ok
        return dictItemRes;
      },
      async _getDictKey({ atomClass, atomClassBase, atomStage }) {
        // atomClassBase
        if (!atomClassBase) {
          const useStoreAtomClasses = await Vue.prototype.$meta.store.use('a/basestore/atomClasses');
          atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
        }
        // atomStage
        const useAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useAtomStage.toString({ atomStage });
        if (!atomStage) return null;
        // dictKey
        const dictKey = Vue.prototype.$meta.util.getProperty(atomClassBase, `dict.states.${atomStage}.dictKey`);
        if (!dictKey) return null;
        // ok
        return dictKey;
      },
      async _getDict({ atomClass, atomClassBase, atomStage }) {
        // atomClassBase
        if (!atomClassBase) {
          const useStoreAtomClasses = await Vue.prototype.$meta.store.use('a/basestore/atomClasses');
          atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
        }
        // dictKey
        const dictKey = this._getDictKey({ atomClass, atomClassBase, atomStage });
        if (!dictKey) return null;
        // default
        if (dictKey === 'default') {
          return await ctx.bean.dict.findItem({
            dictKey: this.dictKeyDefault,
            code: atomState,
          });
        }
        // dictItem
        const dictItem = await ctx.bean.dict.findItem({
          dictKey,
          code: atomState,
        });
        if (dictItem) return dictItem;
        // check if dictKeyDefault
        if (dictKey === this.dictKeyDefault) return null;
        // check flow stage
        const flowStage = atomClassBase.flow?.stage || 'draft';
        atomStage = ctx.bean.atomStage.toString({ atomStage });
        if (flowStage !== atomStage) return null;
        // try default
        return await ctx.bean.dict.findItem({
          dictKey: this.dictKeyDefault,
          code: atomState,
        });
      },
    },
  };
}
