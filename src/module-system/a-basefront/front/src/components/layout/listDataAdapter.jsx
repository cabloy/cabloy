export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      data: {
        providerName: null, // continuous / paged / others
        providers: {},
      },
    };
  },
  computed: {
    providerCurrent() {
      return this.providers[this.providerName];
    },
  },
  methods: {
    async providerSwitch(options) {
      // providerName
      const providerName = options.providerName;
      // provider
      let provider = this.providers[providerName];
      if (!provider) {
        provider = await this.providerCreate(providerName);
        if (!provider) throw new Error(`not found list layout data provider: ${providerName}`);
        this.$set(this.providers, providerName, provider);
      }
      // provider switch
      await provider.switch(options);
      // save as ready
      this.providerName = providerName;
    },
    async providerCreate(providerName) {
      // config component
      const configComponent = this.getProviderConfig(providerName).component;
      // load module
      await this.$meta.module.use(configComponent.module);
      // create provider
      const providerOptions = {
        propsData: {
          layoutManager: this,
        },
      };
      return this.$meta.util.createComponentInstance(configComponent.name, providerOptions);
    },
    getProviderConfig(providerName) {
      return this.$meta.util.getProperty(this.layoutManager.base.config, `render.list.info.data.adapter.providers.${providerName}`);
    },
    data_callMethod(methodName, ...args) {
      if (this.data_provider) {
        return this.data_provider[methodName](...args);
      }
      if (this.layout.instance && this.layout.instance[methodName]) {
        return this.layout.instance[methodName](...args);
      }
      return null;
    },
    data_onPageRefresh(force) {
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
    data_renderLoadMore() {
      return this.data_callMethod('renderLoadMore');
    },
  },
};
