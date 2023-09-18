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
      // load module
      const moduleExtend = await this.$meta.module.use(configComponent.module);
      // create extend
      const options = {
        propsData: {
          adapter: this.timeline_getAdapter(),
        },
      };
      const component = moduleExtend.options.components[configComponent.name];
      if (!component) {
        throw new Error(`timeline.component not found: ${configComponent.module}:${configComponent.name}`);
      }
      const instance = this.$meta.util.createComponentInstance(component, options);
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
      // check if edit mode
      if (this.container.mode === 'edit') return;
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
