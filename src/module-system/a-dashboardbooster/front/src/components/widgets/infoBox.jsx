const propsSchema = {
  type: 'object',
  properties: {
    backgroundColor: {
      type: 'string',
      ebType: 'colorPicker',
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
        <f7-card class="eb-widget-info-box" style={{ backgroundColor: this.backgroundColor }}>
          <f7-card-content class="info-box-body">
            <div class="title">{this.infoTitle}</div>
            <div class="subtitle">{this.infoSubTitle}</div>
            <div class="info-box-icon">
              <f7-icon f7={this.infoIcon}></f7-icon>
            </div>
          </f7-card-content>
          <f7-card-footer class="info-box-footer">
            <div></div>
            <eb-link iconF7="::arrow-right">{this.$text('More info')}</eb-link>
          </f7-card-footer>
        </f7-card>
      );
    },
  };
}
