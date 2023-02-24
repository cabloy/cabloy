export default {
  data() {
    return {
      base: {
        configDetailBase: null,
        configDetail: null,
        //
        item: null,
        detailClass: null,
        module: null,
        validateParams: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.detailActionsAll;
    },
  },
  mounted() {
    this.$meta.eventHub.$on('detail:action', this.base_onActionChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('detail:action', this.base_onActionChanged);
  },
  methods: {
    async base_onInit() {
      // load detailClasses
      await this.$store.dispatch('a/base/getDetailClasses');
      // load detailActions
      await this.$store.dispatch('a/base/getDetailActions');
    },
    async base_loadItem() {
      try {
        // item
        const options = this.base_prepareReadOptions();
        this.base.item = await this.$api.post('/a/detail/detail/read', {
          flowTaskId: this.container.flowTaskId,
          key: { detailId: this.container.detailId },
          options,
        });
        // detailClass
        this.base.detailClass = {
          id: this.base.item.detailClassId,
          module: this.base.item.module,
          detailClassName: this.base.item.detailClassName,
        };
        // module
        this.base.module = await this.$meta.module.use(this.base.item.module);
        // validateParams
        const res = await this.$api.post('/a/detail/detail/validator', {
          detailClass: { id: this.base.item.detailClassId },
        });
        this.base.validateParams = {
          module: res.module,
          validator: res.validator,
        };
        // actions
        await this.actions_fetchActions();
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    base_prepareReadOptions() {
      // options
      const options = {};
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      if (stage === undefined) return undefined;
      return stage === 0 ? 'draft' : stage === 1 ? 'formal' : 'history';
    },
    async base_onActionChanged(data) {
      const key = data.key;
      const action = data.action;

      if (!this.base_ready) return;
      if (this.base.item.detailId !== key.detailId) return;

      if (this.container.mode === 'edit') {
        // just update time
        this.base.item.detailUpdatedAt = new Date();
        return;
      }

      // create
      if (action.name === 'create') {
        // do nothing
        return;
      }
      // delete
      if (action.name === 'delete') {
        this.base.item = null;
        this.base.notfound = true;
        this.base.ready = false;
        return;
      }
      // others
      await this.base_loadItem();
    },
  },
};
