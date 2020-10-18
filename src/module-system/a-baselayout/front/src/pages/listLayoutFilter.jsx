import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
    };
  },
  methods: {
    _getFilterComponentOptions() {
      return {
        props: {
          layoutManager: this.contextParams.layoutManager,
          filterConfig: this.contextParams.filterConfig,
        },
      };
    },
  },
  render() {
    let domComponent;
    if (this.contextParams) {
      const filterConfig = this.contextParams.filterConfig;
      domComponent = (
        <eb-component module={filterConfig.component.module} name={filterConfig.component.name} options={this._getFilterComponentOptions()}></eb-component>
      );
    }
    return (
      <eb-page>
        {domComponent}
      </eb-page>
    );
  },
};
