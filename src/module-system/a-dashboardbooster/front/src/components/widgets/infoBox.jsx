const propsSchema = {
  type: 'object',
  properties: {
    backgroundColor: {
      type: 'string',
      ebType: 'atom',
      ebTitle: 'BackgroundColor',
    },
  },
};

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
          props: propsSchema,
          attrs: null,
        },
      },
    },
    mixins: [ebDashboardWidgetBase],
    props: {
      backgroundColor: {
        type: String,
      },
    },
    data() {
      return {};
    },
    methods: {},
    render() {
      return (
        <div class="eb-widget-info-box" style={{ backgroundColor: this.backgroundColor }}>
          <div class="info-box-body">
            <div class="title">150</div>
            <div class="subtitle">New Orders</div>
          </div>
          <div class="info-box-icon"></div>
          <div href="#" class="info-box-footer">
            <eb-link>More info</eb-link>
          </div>
        </div>
      );
    },
  };
}
