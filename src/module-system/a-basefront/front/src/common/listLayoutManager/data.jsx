import layoutListDataProviderContinuous from '../../components/layout/listDataProviderContinuous.jsx';
import layoutListDataProviderPaged from '../../components/layout/listDataProviderPaged.jsx';

export default {
  data() {
    return {
      data: {
        mode: null, // continuous / paged / null
        providerContinuous: null,
        providerPaged: null,
      },
    };
  },
  computed: {
    data_provider() {
      if (this.mode === 'continuous') return this.providerContinuous;
      if (this.mode === 'paged') return this.providerPaged;
      return null;
    },
  },
  methods: {
    async data_providerSwitch(options) {
      // mode
      this.mode = options.mode;
      // provider
      const providerOptions = {
        propsData: {
          layoutManager: this,
        },
      };
      if (this.mode === 'continuous' && !this.providerContinuous) {
        this.providerContinuous = this.$meta.util.createComponentInstance(layoutListDataProviderContinuous, providerOptions);
      } else if (this.mode === 'paged' && !this.providerPaged) {
        this.providerPaged = this.$meta.util.createComponentInstance(layoutListDataProviderPaged, providerOptions);
      }
      // provider init
      if (this.data_provider) {
        await this.data_provider.switch(options);
      }
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
