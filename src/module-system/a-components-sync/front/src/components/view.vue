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
    getSizeExtent() {
      const view = this.$$(this.$el);
      const size = {
        width: view.width(),
        height: view.height(),
      };
      return size;
    },
    close() {
      this.$f7router.close();
    }
  },
  mounted() {
    const self = this;
    const el = self.$refs.el;
    self.$f7ready(f7Instance => {
      if (self.props.init) return;
      self.routerData.instance = f7Instance.views.create(el, Object.assign({
        on: {
          init: self.onViewInit,
        },
      }, noUndefinedProps(self.$options.propsData || {})));
      self.f7View = self.routerData.instance;
      self.f7View.on('swipebackMove', self.onSwipeBackMove);
      self.f7View.on('swipebackBeforeChange', self.onSwipeBackBeforeChange);
      self.f7View.on('swipebackAfterChange', self.onSwipeBackAfterChange);
      self.f7View.on('swipebackBeforeReset', self.onSwipeBackBeforeReset);
      self.f7View.on('swipebackAfterReset', self.onSwipeBackAfterReset);
      // viewReady
      this.$emit('view:ready', self);
    });
  },
};

function noUndefinedProps(obj) {
  const o = {};
  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'undefined') o[key] = obj[key];
  });
  return o;
}

</script>
<style scoped>
</style>
