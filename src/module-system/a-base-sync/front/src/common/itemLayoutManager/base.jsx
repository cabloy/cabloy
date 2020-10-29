export default {
  data() {
    return {
      base: {
        ready: false,
        configAtomBase: null,
        configAtom: null,
        //
        item: null,
        atomClass: null,
        module: null,
        validateParams: null,
        notfound: false,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.atomClassesAll && this.actionsAll;
    },
    base_user() {
      return this.$store.state.auth.user.op;
    },
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    async base_loadItem() {
      try {
        // item
        const options = this.base_prepareReadOptions();
        this.base.item = await this.$api.post('/a/base/atom/read', {
          key: { atomId: this.container.atomId },
          options,
        });
        // atomClass
        this.base.atomClass = {
          id: this.base.item.atomClassId,
          module: this.base.item.module,
          atomClassName: this.base.item.atomClassName,
        };
        // module
        this.base.module = await this.$meta.module.use(this.base.item.module);
        // validateParams
        const res = await this.$api.post('/a/base/atom/validator', {
          atomClass: { id: this.base.item.atomClassId },
        });
        this.base.validateParams = {
          module: res.module,
          validator: res.validator,
        };
        // actions
        await this.actions_fetchActions();
      } catch (err) {
        this.base.notfound = true;
      }
    },
    base_prepareReadOptions() {
      // options
      const options = {
      };
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      return stage === 0 ? 'draft' : stage === 1 ? 'archive' : 'history';
    },
  },
};
