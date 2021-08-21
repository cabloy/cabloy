<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const _propsBasic = ['title', 'widthSmall', 'widthMedium', 'widthLarge', 'height'];
export default {
  mixins: [ebPageContext],
  data() {
    return {
      widgetId: this.$f7route.query.widgetId,
      propsSchemaDynamic: null,
      widget: null,
      widgetReal: null,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
  },
  created() {
    this.widget = this.contextParams.widget;
    this.widgetReal = this.dashboard.__getWidgetRealById(this.widget.options.id);
    this.propsSchemaDynamic = this.widgetReal.getPropsSchema();
  },
  mounted() {
    this.widget.$on('widget:destroy', this.onWidgetDestroy);
    this.widgetReal.$on('widget:propsSchemaChange', this.onWidgetPropsSchemaChange);
    this.dashboard.$on('dashboard:profileChange', this.onDashboardProfileChange);
  },
  beforeDestroy() {
    this.widget.$off('widget:destroy', this.onWidgetDestroy);
    this.widgetReal.$off('widget:propsSchemaChange', this.onWidgetPropsSchemaChange);
    this.dashboard.$off('dashboard:profileChange', this.onDashboardProfileChange);
    this.widget = null;
    this.widgetReal = null;
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
    onDashboardProfileChange() {
      this.$view.close();
    },
    onWidgetPropsSchemaChange() {
      this.propsSchemaDynamic = this.widgetReal.getPropsSchema();
    },
    onWidgetDestroy() {
      this.$view.close();
    },
    onPerformAddWidget() {
      this.dashboard.onPerformAddWidget(this, this.widget);
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
          callback: (/* code, data*/) => {},
        },
      });
    },
    _getSchemaData(propsSchema) {
      const data = {};
      for (const propertyName in propsSchema.properties) {
        // const property = propsSchema.properties[propertyName];
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
      const domActions = [];
      if (this.widget.options.group) {
        domActions.push(
          c('eb-link', {
            key: 'action-addWidget',
            props: {
              iconMaterial: 'add',
              text: this.$text('Add Widget'),
              onPerform: this.onPerformAddWidget,
            },
          })
        );
      }
      const domNavRight = c('f7-nav-right', {}, domActions);
      return c(
        'eb-navbar',
        {
          props: {
            title: this._getPageTitle(),
            ebBackLink: 'Back',
          },
        },
        [domNavRight]
      );
    },
    _checkPropertyValid(propertyName) {
      if (!this.propsSchemaDynamic) return true;
      return _propsBasic.indexOf(propertyName) > -1 || this.propsSchemaDynamic.indexOf(propertyName) > -1;
    },
    _renderListGroup({ c, title, opened, propsSchema }) {
      // children
      const children = [];
      for (const propertyName in propsSchema) {
        if (!this._checkPropertyValid(propertyName)) continue;
        const propertySchema = propsSchema[propertyName];
        const validateItem = c('eb-list-item-validate', {
          props: {
            dataKey: propertyName,
          },
        });
        const link = c(
          'eb-link',
          {
            key: propertyName,
            staticClass: 'no-ripple display-block',
            props: {
              context: { propertySchema, propertyName },
              onPerform: this.onPerformPropertyEdit,
            },
          },
          [validateItem]
        );
        children.push(link);
      }
      // list
      const list = c(
        'f7-list',
        {
          props: {
            inset: true,
          },
        },
        children
      );
      const content = c('f7-accordion-content', {}, [list]);
      return c(
        'f7-list-item',
        {
          props: {
            title: this.$text(title),
            accordionItem: true,
            accordionItemOpened: opened,
          },
        },
        [content]
      );
    },
    _renderList(c) {
      // schema
      const [propsSchema, propsCategories] = this.widget._getPropsSchemaCategoryGrouping(this.widget.options);
      const basicOnly = Object.keys(propsCategories).length === 1;
      // schema data
      const schemaData = this._getSchemaData(propsSchema);
      // list
      const children = [];
      for (const propsCategoryKey in propsCategories) {
        children.push(
          this._renderListGroup({
            c,
            title: propsCategoryKey || 'General',
            opened: propsCategoryKey !== 'Basic' || basicOnly,
            propsSchema: propsCategories[propsCategoryKey],
          })
        );
      }
      // list
      const list = c(
        'eb-list',
        {
          props: {
            noHairlinesMd: true,
            accordionList: true,
          },
        },
        children
      );
      // validate
      return c(
        'eb-validate',
        {
          ref: 'validate',
          props: {
            auto: false,
            readOnly: true,
            data: schemaData,
            meta: {
              schema: {
                module: 'a-dashboard',
                schema: propsSchema,
              },
            },
          },
        },
        [list]
      );
    },
  },
};
</script>
