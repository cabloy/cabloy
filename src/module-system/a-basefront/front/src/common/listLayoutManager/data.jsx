export default {
  data() {
    return {
      data: {
        adapter: null,
      },
    };
  },
  methods: {
    async data_adapterInit() {
      // config component
      const configComponent = this.$meta.util.getProperty(this.base.config, 'render.list.info.data.adapter.component');
      // load module
      await this.$meta.module.use(configComponent.module);
      // create adapter
      const options = {
        propsData: {
          layoutManager: this,
        },
      };
      this.adapter = this.$meta.util.createComponentInstance(configComponent.name, options);
    },
  },
};
