import Star from './adapter/star.jsx';
import Labels from './adapter/labels.jsx';

export default {
  mixins: [Star, Labels],
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
      providerName: null, // continuous / paged / others
      providers: {},
    };
  },
  computed: {
    providerCurrent() {
      return this.providers[this.providerName];
    },
  },
  beforeDestroy() {
    for (const key in this.providers) {
      const provider = this.providers[key];
      provider.$destroy();
    }
    this.providers = {};
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
      const moduleProvider = await this.$meta.module.use(configComponent.module);
      // create provider
      const providerOptions = {
        propsData: {
          layoutManager: this.layoutManager,
        },
      };
      const component = moduleProvider.options.components[configComponent.name];
      return this.$meta.util.createComponentInstance(component, providerOptions);
    },
    getProviderConfig(providerName) {
      return this.$meta.util.getProperty(this.layoutManager.base.config, `render.list.info.data.adapter.providers.${providerName}`);
    },
    _callMethod(methodName, ...args) {
      const provider = this.providerCurrent;
      if (!provider) return null; // e.g. renderLoadMore
      return provider[methodName](...args);
    },
    onPageRefresh(force) {
      return this._callMethod('onPageRefresh', force);
    },
    onPageInfinite() {
      return this._callMethod('onPageInfinite');
    },
    onPageClear() {
      return this._callMethod('onPageClear');
    },
    getItems() {
      const items = this._callMethod('getItems');
      return items || [];
    },
    renderLoadMore() {
      return this._callMethod('renderLoadMore');
    },
    findItem(atomId) {
      const res = this._callMethod('findItem', atomId);
      if (res) return res;
      return { pageNum: null, items: null, index: -1 };
    },
  },
};
