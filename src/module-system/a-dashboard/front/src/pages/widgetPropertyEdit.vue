<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      widgetId: this.$f7route.query.widgetId,
      propertyName: this.$f7route.query.propertyName,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    widget() {
      return this.contextParams.widget;
    },
    propertySchema() {
      return this.contextParams.propertySchema;
    },
  },
  created() {},
  render(c) {
    const children = [];
    // navbar
    children.push(this._renderNavbar(c));
    // valueType
    children.push(this._renderValueTypes(c));
    // ok
    return c('eb-page', {
      staticClass: 'widget-property-edit',
    }, children);
  },
  methods: {
    _getPropsSchemaBasic() {
      return this.$config.widget.schema.basic;
    },
    _getPropsSchemaGeneral() {
      const [widgetItem] = this.dashboard.__findWidgetRealById(this.widgetId);
      const component = widgetItem.widgetReal.$options;
      return (component.meta && component.meta.schema && component.meta.schema.props) || null;
    },
    _getPageTitle() {
      const title = this.$text('Property');
      if (!this.propertySchema) return title;
      return `${title}: ${this.$text(this.propertySchema.ebTitle)}`;
    },
    _renderNavbar(c) {
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      });
    },
    _renderValueTypes(c) {
      const children = [];
      const propertyReal = this.widget.__getPropertyReal(this.propertyName);
      const isDynamic = this.propertySchema.ebBindOnly || (propertyReal && (propertyReal.bind || propertyReal.binds));
      // static
      if (!this.propertySchema.ebBindOnly) {
        children.push(c('f7-radio', {
          props: {
            name: 'valueType',
            value: 'static',
            checked: !isDynamic,
          },
        }));
        children.push(c('span', {
          domProps: {
            innerText: this.$text('Static'),
          },
        }));
      }
      // dynamic
      children.push(c('f7-radio', {
        props: {
          name: 'valueType',
          value: 'dynamic',
          checked: isDynamic,
        },
      }));
      children.push(c('span', {
        domProps: {
          innerText: this.$text('Dynamic'),
        },
      }));
      return c('div', {
        staticClass: 'value-types',
      }, children);
    },
  },

}

</script>
