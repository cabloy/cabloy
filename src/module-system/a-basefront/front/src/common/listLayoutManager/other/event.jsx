export default {
  mounted() {
    this.$meta.eventHub.$on('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.event_onActionsChanged);
    // this.$meta.eventHub.$on('atom:action:ext', this.event_onActionExtChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.event_onActionsChanged);
    // this.$meta.eventHub.$off('atom:action:ext', this.event_onActionExtChanged);
  },
  methods: {
    async event_onActionChanged_create(data) {
      const key = data.key;
      const atom = data.atom;
      // refresh list
      await this.data.adapter._loopProviders(async provider => {
        this.data.adapter._callMethodProvider(provider, 'onPageRefresh', { key, item: atom });
      });
    },
    async event_onActionChanged_delete(data) {
      const key = data.key;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        // findItem
        const bundle = this.data.adapter.findItemProvier(provider, key.atomId);
        // item: support tree provider
        const { item } = bundle;
        if (!item) return;
        // delete
        this.data.adapter._callMethodProvider(provider, 'spliceItem', bundle);
      });
    },
    async event_onActionChanged_others(data) {
      const key = data.key;
      const atomClass = data.atomClass;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        // findItem
        const bundle = this.data.adapter.findItemProvier(provider, key.atomId);
        // item: support tree provider
        const { item } = bundle;
        if (!item) return;
        // fetch new atom
        const options = this.base_prepareReadOptions();
        const itemNew = await this.$api.post('/a/base/atom/read', {
          key,
          atomClass,
          options,
        });
        this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, itemNew);
      });
    },
    async event_onActionChanged_addChildNode(data) {
      const key = data.key;
      const node = data.node;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        this.data.adapter._callMethodProvider(provider, 'addChildNode', { key, node });
      });
    },
    async event_onActionChanged_moveNode(data) {
      const key = data.key;
      const node = data.node;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        this.data.adapter._callMethodProvider(provider, 'moveNode', { key, node });
      });
    },
    async event_checkIfEventActionValid(data) {
      const atomClass = data.atomClass;
      if (!atomClass) throw new Error('Should specify atom class');

      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass });

      // params
      const params = this.base_prepareSelectParams({ setOrder: false });
      const paramsAtomClass = params.atomClass;
      const paramsStage = params.options.stage;

      // check stage for create
      if (data.action?.name === 'create') {
        if (!atomClassBase.itemOnly && this.$meta.util.stageToString(data.atom.atomStage) !== paramsStage) {
          // do nothing
          return false;
        }
      }
      // check atomClass
      if (paramsAtomClass) {
        if (paramsAtomClass.module !== atomClass.module || paramsAtomClass.atomClassName !== atomClass.atomClassName) {
          // do nothing
          return false;
        }
      }
      if (!paramsAtomClass) {
        if (atomClassBase.itemOnly) {
          // do nothing
          return false;
        }
      }
      // ok
      return true;
    },
    async event_onActionChanged(data) {
      // const atomClass = data.atomClass;
      const action = data.action;
      const res = await this.event_checkIfEventActionValid(data);
      if (!res) {
        return;
      }
      if (action.name === 'create') {
        // create
        await this.event_onActionChanged_create(data);
      } else if (action.name === 'delete') {
        // delete
        await this.event_onActionChanged_delete(data);
      } else if (action.name === 'addChildNode') {
        // addChildNode
        await this.event_onActionChanged_addChildNode(data);
      } else if (action.name === 'moveNode') {
        // moveNode
        await this.event_onActionChanged_moveNode(data);
      } else if (action.name === 'moveUp' || action.name === 'moveDown') {
        // moveUp/moveDown
        await this.event_onActionChanged_moveLineNo(data);
      } else {
        // others
        await this.event_onActionChanged_others(data);
      }
    },
    async event_onActionChanged_moveLineNo(data) {
      const { action, result } = data;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        if (!result) return;
        const a = action.name === 'moveUp' ? result.to.atomId : result.from.atomId;
        const b = action.name === 'moveUp' ? result.from.atomId : result.to.atomId;
        const findA = this.data.adapter.findItemProvier(provider, a);
        const items = findA.items;
        const aIndex = findA.index;
        const findB = this.data.adapter.findItemProvier(provider, b);
        const bIndex = findB.index;
        if (aIndex === -1 || bIndex === -1) {
          // load
          this.data.adapter._callMethodProvider(provider, 'onPageRefresh');
          return;
        }
        const row = this.data.adapter._callMethodProvider(provider, 'spliceItem', { items, index: bIndex });
        this.data.adapter._callMethodProvider(provider, 'spliceItem', { items, index: aIndex }, 0, row[0]);
        return;
      });
    },
    async event_onActionsChanged(data) {
      // const atomClass = data.atomClass;
      const key = data.key;
      if (!(await this.event_checkIfEventActionValid(data))) {
        return;
      }
      // loop
      await this.data.adapter._loopProviders(async provider => {
        // findItem
        const bundle = this.data.adapter.findItemProvier(provider, key.atomId);
        // item: support tree provider
        const { item } = bundle;
        if (!item) return;
        this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, {
          ...item,
          _actions: null,
        });
      });
    },
    // *** if enabled, the arguments layout should be same as atom:action
    //        and also should check if atomClass valid
    // async event_onActionExtChanged(bundle) {
    //   // loop
    //   await this.data.adapter._loopProviders(async provider => {
    //     this.data.adapter._callMethodProvider(provider, 'onActionExt', bundle);
    //   });
    // },
  },
};
