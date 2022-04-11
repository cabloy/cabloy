<script>
import Vue from 'vue';
import perform from '../../common/perform.js';
import link from '../../common/link.js';
const f7TreeviewItem = Vue.prototype.$meta.util.extend({}, Vue.options.components['f7-treeview-item'].extendOptions);
delete f7TreeviewItem.props.href;
export default {
  meta: {
    global: true,
  },
  name: 'eb-treeview-item',
  extends: f7TreeviewItem,
  mixins: [perform, link],
  mounted() {
    this.$$(this.$el).on('contextmenu', this.onContextMenu);
    if (this.externalLink) {
      this.$nextTick(() => {
        const linkEl = this.getLinkEl();
        if (linkEl) {
          linkEl.addClass('eb-external');
        }
      });
    }
  },
  beforeDestroy() {
    this.$$(this.$el).off('contextmenu', this.onContextMenu);
  },
  methods: {
    onContextMenu(event) {
      event.stopPropagation();
      event.preventDefault();
      // finished the event immediately
      this.$nextTick(() => {
        this.$emit('contextmenuOpened', event);
      });
    },
    getLinkEl() {
      // bypass the popover's link
      const $content = this.$$(this.$el).find('.treeview-item-content').eq(0);
      if ($content.length === 0) return null;
      return $content.closest('a');
    },
  },
};
</script>
<style scoped></style>
