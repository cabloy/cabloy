export default function (Vue) {
  async function __prepareAtomClassBase({ atomClass, atomClassBase }) {
    if (!atomClassBase) {
      const useStoreAtomClasses = await Vue.prototype.$meta.store.use('a/basestore/atomClasses');
      atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });
    }
    return atomClassBase;
  }
  function __prepareAtomStageString({ atomStage }) {
    const useStoreAtomStage = Vue.prototype.$meta.store.useSync('a/base/atomStage');
    return useStoreAtomStage.toString({ atomStage });
  }
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
        atomStage = __prepareAtomStageString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        this.dicts[key] = dict;
      },
      getDictSync({ atomClass, atomStage }) {
        atomStage = __prepareAtomStageString({ atomStage });
        const key = __combineKey({ atomClass, atomStage });
        return Vue.get(this.dicts, key, () => {
          // get async
          return this.getDict({ atomClass, atomStage });
        });
      },
      async getDict({ atomClass, atomStage }) {
        atomStage = __prepareAtomStageString({ atomStage });
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
      async _getDict({ atomClass, atomClassBase, atomStage }) {
        // atomClassBase
        atomClassBase = await __prepareAtomClassBase({ atomClass, atomClassBase });
        // atomStage
        atomStage = __prepareAtomStageString({ atomStage });
        if (!atomStage) return null;
        // check flow stage: maybe not set
        const flowStage = atomClassBase.flow?.stage;
        const flowStageSame = flowStage === atomStage;
        // useStoreDict
        const useStoreDict = await Vue.prototype.$meta.store.use('a/dict/dict');
        // dict: static
        let dict = await this.__getDictStatic({ atomClass, atomClassBase, atomStage });
        if (!dict) {
          // dict: dynamic
          if (flowStageSame) {
            dict = await this.__getDictDynamic({ atomClass, atomStage });
          }
        }
        if (!dict) return null;
        // check flow stage same
        if (!flowStageSame) {
          return dict;
        }
        // dict default
        const dictDefault = await useStoreDict.getDict({ dictKey: this.dictKeyDefault });
        // combine dict/diceDefault
        return __combineDict({ dict, dictDefault });
      },
      async __getDictKeyStatic({ atomClass, atomClassBase, atomStage }) {
        // atomClassBase
        atomClassBase = await __prepareAtomClassBase({ atomClass, atomClassBase });
        // atomStage
        atomStage = __prepareAtomStageString({ atomStage });
        if (!atomStage) return null;
        // dictKey: static
        const dictKey = Vue.prototype.$meta.util.getProperty(
          atomClassBase,
          `fields.dicts.atomState.${atomStage}.dictKey`
        );
        // ok
        return dictKey;
      },
      async __getDictStatic({ atomClass, atomClassBase, atomStage }) {
        // useStoreDict
        const useStoreDict = await Vue.prototype.$meta.store.use('a/dict/dict');
        // dictKey
        const dictKey = await this.__getDictKeyStatic({ atomClass, atomClassBase, atomStage });
        if (!dictKey) return null;
        // dict
        return await useStoreDict.getDict({ dictKey });
      },
      async __getDictDynamic({ atomClass }) {
        return aa.bb;
      },
    },
  };
}
