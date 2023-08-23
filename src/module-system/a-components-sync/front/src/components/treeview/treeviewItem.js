import Vue from 'vue';
import perform from '../../common/perform.js';
import link from '../../common/link.js';
import contextMenu from '../../common/contextMenu.js';
const f7TreeviewItem = Vue.options.components['f7-treeview-item'].extendOptions;
delete f7TreeviewItem.props.href;
export default {
  meta: {
    global: true,
  },
  name: 'eb-treeview-item',
  extends: f7TreeviewItem,
  mixins: [perform, link, contextMenu],
  mounted() {
    this.contextmenu_checkPopover = false;
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
      const $content = this.$$(this.$el).find('.treeview-item-content').eq(0);
      if ($content.length === 0) return null;
      return $content.closest('a');
    },
  },
};
