<script>
import widgetPropertyEditDynamic from '../components/widgetPropertyEditDynamic.vue';

import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    widgetPropertyEditDynamic,
  },
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
    propertyBind() {
      return this.contextParams.propertyBind;
    },
  },
  created() {},
  render(c) {
    const children = [];
    // navbar
    children.push(this._renderNavbar(c));
    // bind
    children.push(this._renderValueDynamicSingle(c, this.propertyBind));
    // ok
    return c('eb-page', {}, children);
  },
  methods: {
    _getPageTitle() {
      return this.$text('Data Source');
    },
    _onBindChange(bind) {
      this.contextCallback(200, bind);
    },
    _renderNavbar(c) {
      return c('eb-navbar', {
        props: {
          title: this._getPageTitle(),
          ebBackLink: 'Back',
        },
      });
    },
    _renderValueDynamicSingle(c, propertyBind) {
      return c('widget-property-edit-dynamic', {
        props: {
          dashboard: this.dashboard,
          widgetId: this.widgetId,
          propertyName: this.propertyName,
          propertyBind,
        },
        on: {
          'bind:change': this._onBindChange,
        },
      });
    },
  },

}

</script>
