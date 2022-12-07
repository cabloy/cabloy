import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
import contextMenu from '../common/contextMenu.js';
import validateCheck from '../common/validate/validateCheck.js';
const f7ListItem = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-list-item'].extendOptions);
delete f7ListItem.props.href;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item',
  extends: f7ListItem,
  mixins: [perform, link, contextMenu, validateCheck],
  mounted() {
    if (this.externalLink) {
      this.$nextTick(() => {
        const linkEl = this.getLinkEl();
        if (linkEl) {
          linkEl.addClass('eb-external');
        }
      });
    }
  },
  methods: {
    getLinkEl() {
      // bypass the popover's link
      const content = this.$$(this.$el).find('.item-content');
      if (content.length === 0) return null;
      return this.$$(content[0]).closest('a');
    },
    onValidateError(error) {
      const panel = this.$$(this.$el);
      if (error) {
        panel.addClass('item-panel-invalid');
      } else {
        panel.removeClass('item-panel-invalid');
      }
    },
  },
};
