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
    const propertyReal = this.widget.__getPropertyReal(this.propertyName);
    const isDynamic = this.propertySchema.ebBindOnly || (propertyReal && (propertyReal.bind || propertyReal.binds));
    // navbar
    children.push(this._renderNavbar(c));
    // valueType
    children.push(this._renderValueTypes(c, propertyReal, isDynamic));
    // static
    if (!isDynamic) {
      children.push(this._renderValueStatic(c, propertyReal));
    } else {}
    // ok
    return c('eb-page', {
      staticClass: 'widget-property-edit',
    }, children);
  },
  methods: {
    _getPageTitle() {
      return `${this.$text('Property')}: ${this.$text(this.propertySchema.ebTitle)}`;
    },
    _setPropertyValue: Vue.prototype.$meta.util.debounce(function(data) {
      this.widget.__setPropertyRealValue(this.propertyName, data);
    }, 600),
    _renderNavbar(c) {
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      });
    },
    _renderValueStatic(c, propertyReal) {
      // schema
      const schema = {
        type: 'object',
        properties: {
          [this.propertyName]: this.propertySchema,
        },
      };
      // data
      const data = {
        [this.propertyName]: this.widget.__getPropertyRealValue(this.propertyName),
      };
      // validate
      return c('eb-validate', {
        ref: 'validate',
        props: {
          auto: true,
          readOnly: false,
          data,
          meta: {
            schema,
          },
        },
        on: {
          'validateItem:change': (key, value) => {
            return this._setPropertyValue({ value });
          }
        }
      });
    },
    _renderValueTypes(c, propertyReal, isDynamic) {
      const children = [];
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
