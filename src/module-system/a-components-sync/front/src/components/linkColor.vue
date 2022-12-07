<script>
import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
import contextMenu from '../common/contextMenu.js';
import stats from '../common/stats.js';
const f7Link = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-link'].extendOptions);
delete f7Link.props.href;
delete f7Link.props.badgeColor;
delete f7Link.props.iconBadge;
export default {
  meta: {
    global: true,
  },
  name: 'eb-link-color',
  extends: f7Link,
  mixins: [perform, link, contextMenu, stats],
  data() {
    return {
      badgeColor: null,
      iconBadge: null,
      statsValue: null,
    };
  },
  computed: {
    statsColor() {
      if (!this.statsValue) return null;
      if (this.statsValue.red) return 'red';
      if (this.statsValue.orange) return 'orange';
      if (this.statsValue.gray) return 'gray';
      return null;
    },
  },
  methods: {
    getLinkEl() {
      return this.$$(this.$el);
    },
    stats_onChange(statsValue) {
      this.statsValue = statsValue;
      this.badgeColor = this.statsColor;
      this.iconBadge = this.onAdjustValue(statsValue);
      this.$emit('stats_change', statsValue);
    },
    onAdjustValue(statsValue) {
      if (!statsValue) return null;
      return statsValue.red || statsValue.orange || statsValue.gray || null;
    },
  },
};
</script>
<style scoped></style>
