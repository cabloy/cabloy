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
