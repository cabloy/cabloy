export default {
  data() {
    return {
      timeline: {
        instance: null,
      },
    };
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
        return;
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
    },
    timeline_getAdapter() {
      return {
        ctx: this,
        layoutManager: this,
      };
    },
  },
};
