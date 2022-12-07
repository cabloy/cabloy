<script>
import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
import contextMenu from '../common/contextMenu.js';
import stats from '../common/stats.js';
const f7Link = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-link'].extendOptions);
delete f7Link.props.href;
export default {
  meta: {
    global: true,
  },
  name: 'eb-link',
  extends: f7Link,
  mixins: [perform, link, contextMenu, stats],
  props: {
    link: {
      type: [String, Boolean],
      default: true,
    },
  },
  methods: {
    getLinkEl() {
      return this.$$(this.$el);
    },
    stats_onChange(value) {
      this.$emit('stats_change', value);
    },
  },
};
</script>
<style scoped></style>
