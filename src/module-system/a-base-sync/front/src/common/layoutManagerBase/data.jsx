export default {
  data() {
    return {
      data: {
        adapter: null,
        dataForce: false,
      },
    };
  },
  beforeDestroy() {
    if (this.data.adapter) {
      this.data.adapter.$destroy();
      this.data.adapter = null;
    }
  },
  methods: {
    async data_adapterInit() {
      // config component
      const configComponent = this.$meta.util.getProperty(this.layout.configFull, 'info.data.adapter.component');
      // load module
      const moduleAdapter = await this.$meta.module.use(configComponent.module);
      // create adapter
      const options = {
        propsData: {
          layoutManager: this,
        },
      };
      const component = moduleAdapter.options.components[configComponent.name];
      this.data.adapter = this.$meta.util.createComponentInstance(component, options);
    },
    async data_providerSwitch(options) {
      // autoInit
      if (options.autoInit === undefined) {
        const autoInit = this.data_checkAutoInit();
        options = { ...options, autoInit };
      }
      // adapter init
      if (!this.data.adapter) {
        await this.data_adapterInit();
      }
      // adapter provider switch
      return await this.data.adapter.providerSwitch(options);
    },
    data_checkAutoInit() {
      const containerScene = this.container && this.container.scene;
      const containerAutoInit = this.container && this.container.autoInit;
      const dataForce = this.data.dataForce;
      const autoInit = dataForce || containerAutoInit === undefined ? containerScene !== 'search' : containerAutoInit;
      return autoInit;
    },
    data_callMethod(methodName, ...args) {
      if (!this.data.adapter) return null;
      return this.data.adapter[methodName](...args);
    },
    data_onPageRefresh(force) {
      if (force && !this.data.adapter) {
        this.data.dataForce = true;
        return;
      }
      return this.data_callMethod('onPageRefresh', force);
    },
    data_onPageInfinite() {
      return this.data_callMethod('onPageInfinite');
    },
    data_onPageClear() {
      return this.data_callMethod('onPageClear');
    },
    data_getItems() {
      return this.data_callMethod('getItems');
    },
    data_getItemsAll() {
      return this.data_callMethod('getItemsAll');
    },
    data_findItem(key) {
      return this.data_callMethod('findItem', key);
    },
    data_getLoading() {
      return this.data_callMethod('getLoading');
    },
    data_renderLoadMore() {
      if (!this.layout.instance) return null;
      return this.data_callMethod('renderLoadMore');
    },
  },
};
