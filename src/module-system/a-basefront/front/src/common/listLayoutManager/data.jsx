import layoutListDataContinuous from '../../components/layout/listDataContinuous.jsx';
import layoutListDataPaged from '../../components/layout/listDataPaged.jsx';

export default {
  data() {
    return {
      data: {
        mode: null,
        provider: null,
      },
    };
  },
  methods: {
    onPageRefresh(force) {
      if (!this.provider) return;
      this.provider.onPageRefresh(force);
    },
    onPageInfinite() {
      if (!this.provider) return;
      this.provider.onPageInfinite();
    },
    onPageClear() {
      if (!this.provider) return;
      this.provider.onPageClear();
    },
    getItems() {
      if (!this.provider) return null;
      return this.provider.getItems();
    },
    async data_layout(options) {
      // mode
      this.mode = options.mode;
      // provider
      const providerOptions = {
        propsData: {
          layoutManager: this,
        },
      };
      if (this.mode === 'continuous') {
        this.provider = this.$meta.util.createComponentInstance(layoutListDataContinuous, providerOptions);
      } else if (this.mode === 'paged') {
        this.provider = this.$meta.util.createComponentInstance(layoutListDataPaged, providerOptions);
      } else {
        this.provider = null;
      }
      // provider init
      if (this.provider) {
        await this.provider.switch(options);
      }
    },
  },
};
