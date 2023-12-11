export default {
  data() {
    return {
      timeline: {
        instance: null,
      },
    };
  },
  computed: {
    timeline_flowId() {
      return this.base.item.atomFlowId;
    },
  },
  beforeDestroy() {
    this.timeline_destroyInstance();
  },
  methods: {
    timeline_destroyInstance() {
      if (this.timeline.instance) {
        this.timeline.instance.$destroy();
        this.timeline.instance = null;
      }
    },
    async timeline_createInstance() {
      // config component
      const configComponent = this.$meta.util.getProperty(this.layout.config, 'timeline.component');
      if (!configComponent) {
        this.timeline_destroyInstance();
        return null;
      }
      // create extend
      const options = {
        propsData: {
          adapter: this.timeline_getAdapter(),
        },
      };
      const instance = await this.$meta.util.createComponentInstanceByName(configComponent, options);
      // ready
      this.timeline_destroyInstance();
      this.timeline.instance = instance;
      return instance;
    },
    timeline_getAdapter() {
      return {
        ctx: this,
        layoutManager: this,
        flowId: this.timeline_flowId,
        currentOnly: true,
        inline: true,
      };
    },
    async timeline_loadData() {
      // check if has flow
      if (!this.timeline_flowId) return;
      // init data but not show timeline for edit mode
      // // check if edit mode
      // if (this.container.mode === 'edit') return;
      // create instance
      if (!this.timeline.instance) {
        await this.timeline_createInstance();
      }
      if (!this.timeline.instance) {
        return;
      }
      // load data
      await this.timeline.instance.index_load();
    },
  },
};
