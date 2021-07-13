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
    data_onPageRefresh(force) {
      if (this.provider) {
        return this.provider.onPageRefresh(force);
      }
      if (this.layout.instance && this.layout.instance.onPageRefresh) {
        this.layout.instance.onPageRefresh(force);
      }
    },
    data_onPageInfinite() {
      if (this.provider) {
        return this.provider.onPageInfinite();
      }
      if (this.layout.instance && this.layout.instance.onPageInfinite) {
        this.layout.instance.onPageInfinite();
      }
    },
    data_onPageClear() {
      if (this.provider) {
        return this.provider.onPageClear();
      }
      if (this.layout.instance && this.layout.instance.onPageClear) {
        this.layout.instance.onPageClear();
      }
    },
    data_getItems() {
      if (this.provider) {
        return this.provider.getItems();
      }
      if (this.layout.instance && this.layout.instance.getItems) {
        this.layout.instance.getItems();
      }
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
    data_renderLoadMore() {
      if (!this.provider) return null;
      return this.provider.renderLoadMore();
    },
  },
};
