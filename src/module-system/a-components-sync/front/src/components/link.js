import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
import contextMenu from '../common/contextMenu.js';
import stats from '../common/stats.js';
let f7Link = Vue.options.components['f7-link'].extendOptions;
f7Link = Vue.prototype.$meta.util.patchF7ExtendOptions(f7Link, 'href');
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
