<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      widgetId: this.$f7route.query.widgetId,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    widget() {
      return this.contextParams.widget;
    },
  },
  mounted() {
    this.widget.$on('widget:destroy', this.onWidgetDestroy);
  },
  beforeDestroy() {
    this.widget.$off('widget:destroy', this.onWidgetDestroy);
  },
  render(c) {
    const children = [];
    // navbar
    children.push(this._renderNavbar(c));
    // list
    children.push(this._renderList(c));
    // toolbar
    if (this.widget.options.group) {
      children.push(this._renderToolbar(c));
    }
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
    onPerformPropertyEdit(e, { propertySchema, propertyName }) {
      this.$view.navigate(`/a/dashboard/widget/property/edit?widgetId=${this.widgetId}&propertyName=${propertyName}`, {
        target: '_self',
        context: {
          params: {
            dashboard: this.dashboard,
            widget: this.widget,
            propertySchema,
          },
          callback: (code, data) => {},
        },
      });
    },
    _getSchemaData(propsSchema) {
      const data = {};
      for (const propertyName in propsSchema.properties) {
        const property = propsSchema.properties[propertyName];
        const propertyValue = this.widget.__getPropertyRealValue(propertyName);
        if (propertyValue && (Array.isArray(propertyValue) || typeof propertyValue === 'object')) {
          data[propertyName] = '➡️';
        } else {
          data[propertyName] = propertyValue;
        }
      }
      return data;
    },
    _getPageTitle() {
      return `${this.$text('Properties')}: ${this.widget.__getPropertyRealValue('title')}`;
    },
    _renderNavbar(c) {
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      });
    },
    _renderToolbar(c) {
      const children = [];
      children.push(c('div'));
      children.push(c('eb-button', {
        props: {
          text: this.$text('Add Widget'),
          onPerform: this.onPerformAddWidget,
        },
      }));
      return c('f7-toolbar', {
        props: {
          bottomMd: true,
        },
      }, children);
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
            onPerform: this.onPerformPropertyEdit,
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
      let propsSchemaBasic = this.widget._getPropsSchemaBasic(this.widget.options.group);
      let propsSchemaGeneral = this.widget.options.group ? null : this.widget._getPropsSchemaGeneral(this.widget.options);
      let propsSchema = this.$utils.extend({}, propsSchemaBasic, propsSchemaGeneral);
      const basicOnly = this.widget.options.group || !propsSchemaGeneral;
      // schema data
      let schemaData = this._getSchemaData(propsSchema);
      // list
      const children = [];
      children.push(this._renderListGroup({
        c,
        title: 'Basic',
        opened: basicOnly,
        propsSchema: propsSchemaBasic,
      }));
      if (!basicOnly) {
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
          noHairlinesMd: true,
          accordionList: true,
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
        },
      }, [list]);
    },
  },

}

</script>
