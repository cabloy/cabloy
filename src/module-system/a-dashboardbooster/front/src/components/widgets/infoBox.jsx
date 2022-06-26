// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebDashboardWidgetBase = Vue.prototype.$meta.module.get('a-dashboard').options.mixins.ebDashboardWidgetBase;
  return {
    meta: {
      widget: {
        schema: {
          props: null,
          attrs: null,
        },
      },
    },
    mixins: [ebDashboardWidgetBase],
    data() {
      return {};
    },
    methods: {},
    render() {
      return (
        <f7-card class="demo-widget-simple-chat">
          <f7-card-header>{this.$text('Simple Chat')}</f7-card-header>
          <f7-card-content></f7-card-content>
        </f7-card>
      );
    },
  };
}
