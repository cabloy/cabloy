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
      // params
      const params = this.base_prepareSelectParams({ setOrder: false });
      const paramsAtomClass = params.atomClass;
      const paramsStage = params.options.stage;

      // check stage
      if (this.base_stageToString(atom.atomStage) !== paramsStage) {
        // do nothing
        return;
      }
      // check atomClass
      if (
        paramsAtomClass &&
        (paramsAtomClass.module !== atom.module || paramsAtomClass.atomClassName !== atom.atomClassName)
      ) {
        // do nothing
        return;
      }
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

      const atomClassBase = await this.$store.dispatch('a/base/getAtomClassBase', { atomClass });
      if (atomClassBase.itemOnly) {
        if (!this.base.atomClass) return false;
        if (
          atomClass.module !== this.base.atomClass.module ||
          atomClass.atomClassName !== this.base.atomClass.atomClassName
        ) {
          return false;
        }
      }
      // ok
      return true;
    },
    async event_onActionChanged(data) {
      // const atomClass = data.atomClass;
      const action = data.action;
      if (!(await this.event_checkIfEventActionValid(data))) {
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
      } else {
        // others
        await this.event_onActionChanged_others(data);
      }
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
    // async event_onActionExtChanged(bundle) {
    //   // loop
    //   await this.data.adapter._loopProviders(async provider => {
    //     this.data.adapter._callMethodProvider(provider, 'onActionExt', bundle);
    //   });
    // },
  },
};
