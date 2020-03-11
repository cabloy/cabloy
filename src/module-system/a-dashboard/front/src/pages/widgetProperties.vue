<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
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
  created() {},
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
    _getPropsSchemaBasic() {
      return this.$config.widget.schema.basic;
    },
    _getPropsSchema() {
      const [widgetItem] = this.dashboard.__findWidgetRealById(this.widgetId);
      const component = widgetItem.widgetReal.$options;
      return (component.meta && component.meta.schema && component.meta.schema.props) || null;
    },
    _renderNavbar(c) {
      const children = [];
      if (this.widget.options.group) {
        children.push(c('eb-link', {
          props: {
            text: this.$text('Add Widget'),
            onPerform: this.onPerformAddWidget,
          },
        }));
      }
      const navRight = c('f7-nav-right', {}, children);
      return c('eb-navbar', {
        props: {
          title: this.$text('Properties'),
          ebBackLink: 'Back',
        },
      }, [navRight]);
    },
    _renderListGroup({ c, title, opened, schema }) {
      // children
      const children = [];
      for (const propertyName in schema.properties) {
        const property = schema.properties[propertyName];
        // after
        const propertyValue = this.widget.__getPropertyRealValue(propertyName);
        const after = c('div', {
          slot: 'after',
          domProps: {
            innerText: propertyValue,
          },
        });
        // list item
        children.push(c('eb-list-item', {
          props: {
            title: this.$text(property.ebTitle),
          },
        }, [after]));
      }
      // list
      const list = c('f7-list', {}, children);
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
      // list
      const children = [];
      children.push(this._renderListGroup({
        c,
        title: 'Basic',
        opened: !!this.widget.options.group,
        schema: this._getPropsSchemaBasic(),
      }));
      if (!this.widget.options.group) {
        children.push(this._renderListGroup({
          c,
          title: 'General',
          opened: true,
          schema: this._getPropsSchema(),
        }));
      }

      return c('eb-list', {
        props: {
          form: true,
          noHairlinesMd: true,
          accordionList: true,
        },
        on: {
          submit: this.onFormSubmit,
        },
      }, children);
    }
  },

}

</script>
