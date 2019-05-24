<script>
import Vue from 'vue';
import appMethods from '../common/appMethods.js';
const f7View = Vue.options.components['f7-view'].extendOptions;
export default {
  name: 'eb-view',
  extends: f7View,
  props: {
    size: {
      type: String,
      default: 'small',
    },
    sizeExtent: {
      type: Object,
    },
  },
  data() {
    return appMethods(this);
  },
  methods: {
    getHostEl() {
      const view = this.$$(this.$el);
      const views = view.parents('.views');
      return views.length > 0 ? views : view;
    },
    navigate(url, options) {
      let _options = options || {};
      if (!_options.ctx) {
        _options = this.$utils.extend({}, _options, { ctx: this });
      }
      this.$meta.vueLayout.navigate(url, _options);
    },
    getSizeExtend() {
      const view = this.$$(this.$el);
      const size = {
        width: view.width(),
        height: view.height(),
      };
      return size;
    },
  },
  mounted() {
    const self = this;
    const el = self.$refs.el;
    self.$f7ready(f7Instance => {
      if (self.props.init) return;
      self.routerData = {
        el,
        component: self,
        instance: null,
      };
      self.$vuef7.routers.views.push(self.routerData);
      self.routerData.instance = f7Instance.views.create(el, self.$options.propsData || {});
      self.f7View = self.routerData.instance;
      this.$emit('view:ready', self);
    });
  },
};

</script>
<style scoped>
</style>
