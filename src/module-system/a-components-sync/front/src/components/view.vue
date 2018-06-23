<script>
import Vue from 'vue';
import appMethods from '../common/appMethods.js';
const f7View = Vue.options.components.f7View;
export default {
  name: 'eb-view',
  extends: f7View,
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
      options = options || {};
      if (options.view === 'self') options.view = this.$el.f7View;
      this.$meta.vueLayout.navigate(url, options);
    },
  },
};

</script>
<style scoped>


</style>
