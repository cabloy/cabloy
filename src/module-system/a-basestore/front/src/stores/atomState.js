export default function (Vue) {
  function __combineKey({ atomClass, atomStage }) {
    return `${atomClass.module}:${atomClass.atomClassName}:${atomStage}`;
  }
  function __combineDict({ dict, dictDefault }) {
    const dictNew = Vue.prototype.$meta.util.extend({}, dict);
    for (const dictItemDefault of dictDefault._dictItems) {
      const codeB = dictItemDefault.code < 0 ? 1000 - dictItemDefault.code : dictItemDefault.code;
      const index = dictNew._dictItems.findIndex(item => {
        const codeA = item.code < 0 ? 1000 - item.code : item.code;
        return codeA >= codeB;
      });
      if (index === -1) {
        dictNew._dictItems.push(dictItemDefault);
        dictNew._dictItemsMap[dictItemDefault.code] = dictItemDefault;
      } else {
        const dictItemNew = dictNew._dictItems[index];
        if (dictItemNew.code === dictItemDefault.code) {
          // do nothing if exists
        } else {
          dictNew._dictItems.splice(index, 0, dictItemDefault);
          dictNew._dictItemsMap[dictItemDefault.code] = dictItemDefault;
        }
      }
    }
    return dictNew;
  }

  return {
    state() {
      return {
        dicts: {},
        dictKeyDefault: 'a-dictbooster:dictAtomStateDefault',
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
        const useStoreAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useStoreAtomStage.toString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        this.dicts[key] = dict;
      },
      async getDict({ atomClass, atomStage }) {
        const useStoreAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useStoreAtomStage.toString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        // dict maybe null
        if (this.dicts[key] !== undefined) return this.dicts[key];
        const dict = await this._getDict({ atomClass, atomStage });
        this.setDict({ atomClass, atomStage, dict });
        return dict;
      },
      async findDictItem({ atomClass, atomStage, code, options }) {
        // dict
        const dict = await this.getDict({ atomClass, atomStage });
        // findItem
        const useStoreDict = await Vue.prototype.$meta.store.use('a/dict/dict');
        return await useStoreDict.findItem({ dict, code, options });
      },
      async _getDictKey({ atomClass, atomClassBase, atomStage }) {
        // atomClassBase
        if (!atomClassBase) {
          const useStoreAtomClasses = await Vue.prototype.$meta.store.use('a/basestore/atomClasses');
          atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
        }
        // atomStage
        const useStoreAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useStoreAtomStage.toString({ atomStage });
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
        // atomStage
        const useStoreAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
        atomStage = useStoreAtomStage.toString({ atomStage });
        if (!atomStage) return null;
        // useStoreDict
        const useStoreDict = await Vue.prototype.$meta.store.use('a/dict/dict');
        // dictKey
        const dictKey = await this._getDictKey({ atomClass, atomClassBase, atomStage });
        if (!dictKey) return null;
        // default
        if (dictKey === 'default') {
          return await useStoreDict.getDict({ dictKey: this.dictKeyDefault });
        }
        // dict
        const dict = await useStoreDict.getDict({ dictKey });
        // check if dictKeyDefault
        if (dictKey === this.dictKeyDefault) return dict;
        // check flow stage
        const flowStage = atomClassBase.flow?.stage || 'draft';
        if (flowStage !== atomStage) return dict;
        // dict default
        const dictDefault = await useStoreDict.getDict({ dictKey: this.dictKeyDefault });
        // combine dict/diceDefault
        return __combineDict({ dict, dictDefault });
      },
    },
  };
}
