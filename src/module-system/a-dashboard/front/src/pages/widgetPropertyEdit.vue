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
    // list
    children.push(this._renderList(c));
    // ok
    return c('eb-page', {}, children);
  },
  methods: {
    onWidgetDestroy() {
      this.$view.close();
    },
    onPerformAddWidget() {
      this.$view.navigate('/a/dashboard/widget/add', {
        target: '_self',
        context: {
          callback: (code, data) => {
            if (code === 200) {
              this.widget.onWidgetsAdd(data);
            }
          },
        },
      });
    },
    onFormSubmit(e) {
      e.preventDefault();
    },
    onPerformValidate() {
      return this.$api.post('kitchen-sink/form-schema-validation/saveValidation', {
        data: this.item,
      }).then(() => {
        return true;
      });
    },
    onPerformEdit(e, context) {
      console.log(context.propertySchema, context.propertyName);
    },
    _getPropsSchemaBasic() {
      return this.$config.widget.schema.basic;
    },
    _getPropsSchemaGeneral() {
      const [widgetItem] = this.dashboard.__findWidgetRealById(this.widgetId);
      const component = widgetItem.widgetReal.$options;
      return (component.meta && component.meta.schema && component.meta.schema.props) || null;
    },
    _getSchemaData(propsSchema) {
      const data = {};
      for (const propertyName in propsSchema.properties) {
        const property = propsSchema.properties[propertyName];
        const propertyValue = this.widget.__getPropertyRealValue(propertyName);
        data[propertyName] = propertyValue;
      }
      return data;
    },
    _getPageTitle() {
      const title = this.$text('Property');
      if (!this.propertySchema) return title;
      return `${title}: ${this.$text(this.propertySchema.ebTitle)}`;
    },
    _renderNavbar(c) {
      const children = [];
      if (this.widget.options.group) {
        children.push(c('eb-link', {
          props: {
            text: this._getPageTitle(),
            onPerform: this.onPerformAddWidget,
          },
        }));
      }
      const navRight = c('f7-nav-right', {}, children);
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      }, [navRight]);
    },
    _renderListGroup({ c, title, opened, propsSchema }) {
      // children
      const children = [];
      for (const propertyName in propsSchema.properties) {
        const propertySchema = propsSchema.properties[propertyName];
        const validateItem = c('eb-list-item-validate', {
          props: {
            dataKey: propertyName,
          },
        });
        const link = c('eb-link', {
          staticClass: 'no-ripple display-block',
          props: {
            context: { propertySchema, propertyName },
            onPerform: this.onPerformEdit,
          },
        }, [validateItem]);
        children.push(link);
      }
      // list
      const list = c('f7-list', {
        props: {
          inset: true,
        },
      }, children);
      const content = c('f7-accordion-content', {}, [list]);
      return c('f7-list-item', {
        props: {
          title: this.$text(title),
          accordionItem: true,
          accordionItemOpened: opened,
        },
      }, [content]);
    },
    _renderList(c) {
      // schema
      let propsSchemaBasic = this._getPropsSchemaBasic();
      let propsSchemaGeneral = this.widget.options.group ? null : this._getPropsSchemaGeneral();
      let propsSchema = this.$utils.extend({}, propsSchemaBasic, propsSchemaGeneral);
      // schema data
      let schemaData = this._getSchemaData(propsSchema);
      // list
      const children = [];
      children.push(this._renderListGroup({
        c,
        title: 'Basic',
        opened: !!this.widget.options.group,
        propsSchema: propsSchemaBasic,
      }));
      if (!this.widget.options.group) {
        children.push(this._renderListGroup({
          c,
          title: 'General',
          opened: true,
          propsSchema: propsSchemaGeneral,
        }));
      }
      // list
      const list = c('eb-list', {
        props: {
          form: true,
          noHairlinesMd: true,
          accordionList: true,
        },
        on: {
          submit: this.onFormSubmit,
        },
      }, children);
      // validate
      return c('eb-validate', {
        ref: 'validate',
        props: {
          auto: false,
          readOnly: true,
          data: schemaData,
          meta: {
            schema: propsSchema,
          },
          onPerform: this.onPerformValidate,
        },
      }, [list]);
    },
  },

}

</script>
