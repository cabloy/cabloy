export default {
  data() {
    return {
      base: {
        configAtomBase: null,
        configAtomCms: null,
        configAtom: null,
        //
        item: null,
        atomClass: null,
        atomClassBase: null,
        module: null,
        validateParams: null,
        //
        _atomIdMain: null,
        _atomMain: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.base_userLabels && this.atomClassesAll && this.actionsAll;
    },
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
    base_atomIdMain() {
      return this.base._atomIdMain;
    },
    base_atomMain() {
      return this.container.options.atomMain || this.base._atomMain;
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    async base_onInit() {
      // load atomClasses
      await this.$store.dispatch('a/base/getAtomClasses');
    },
    async base_loadAtomClass() {
      try {
        // check container first
        if (this.container.atomClass) {
          this.base.atomClass = this.container.atomClass;
        } else {
          this.base.atomClass = await this.$api.post('/a/base/atom/atomClass', {
            key: { atomId: this.container.atomId },
          });
        }
        this.base.atomClassBase = this.getAtomClass(this.base.atomClass);
        // module
        this.base.module = await this.$meta.module.use(this.base.atomClass.module);
        // validateParams
        const res = await this.$api.post('/a/base/atom/validator', {
          atomClass: this.base.atomClass,
        });
        this.base.validateParams = {
          module: res.module,
          validator: res.validator,
        };
        // not set: found
        // this.base.notfound = false;
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    async base_loadItem() {
      try {
        // options
        const options = this.base_prepareReadOptions();
        // check create delay
        if (this.container.params?.createDelay) {
          // createDelayGetItem
          const createParams = this.container.params?.createDelay.dataOptions.createParams;
          this.base.item = await this.$api.post('/a/base/atom/createDelayGetItem', createParams);
          // actions
          await this.actions_createDelayActions();
        } else {
          // item
          this.base.item = await this.$api.post('/a/base/atom/read', {
            key: { atomId: this.container.atomId },
            atomClass: this.base.atomClass,
            options,
          });
          // actions
          await this.actions_fetchActions();
        }
        // atomMain
        await this.base_loadAtomMain();
        // found
        this.base.notfound = false;
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    async base_loadAtomMain() {
      if (!this.base.atomClassBase) return;
      if (!this.base.atomClassBase.detail) return;
      if (this.container.options.atomMain) return;
      const atomIdMainFieldName = this.base.atomClassBase.detail.atomIdMain || 'atomIdMain';
      const atomIdMain = this.base.item[atomIdMainFieldName];
      this.base._atomIdMain = atomIdMain;
      this.base._atomMain = await this.$api.post('/a/base/atom/read', {
        key: { atomId: atomIdMain },
        atomClass: this.base.atomClassBase.detail.atomClassMain,
        options: {},
      });
    },
    base_prepareReadOptions() {
      // options
      const options = {};
      // layout
      options.layout = this.layout.current;
      // for detail
      options.containerMode = this.container.mode;
      // need not atomIdMain
      // // atomIdMain
      // options.atomIdMain = this.base_atomIdMain;
      // options
      return options;
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      if (stage === undefined) return undefined;
      return this.base_stageToString(stage);
    },
    base_stageToString(stage) {
      return stage === 0 ? 'draft' : stage === 1 ? 'formal' : 'history';
    },
    // async base_onOpenDrafted(data) {
    //   const key = data.key;

    //   if (!this.base_ready) return;
    //   if (this.base.item.atomId !== key.atomId) return;

    //   await this.actions_fetchActions();
    // },
  },
};
