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
    _switchFolderIcon(el) {
      const $el = this.$$(el);
      // icon
      const $icon = $el.find('i.icon.f7-icons svg use').eq(0);
      if ($icon.length === 0) return;
      // iconName
      const parts = $icon[0].href.baseVal.split('#');
      let iconName = parts[1];
      if (iconName !== 'folder' && iconName !== 'folder-open') return;
      // switch
      if ($el.hasClass('treeview-item-opened')) {
        iconName = 'folder-open';
      } else {
        iconName = 'folder';
      }
      $icon[0].href.baseVal = [parts[0], iconName].join('#');
    },
    onOpen(el) {
      if (this.eventTargetEl !== el) return;
      this._switchFolderIcon(el);
      this.dispatchEvent('treeview:open treeviewOpen', el);
    },
    onClose(el) {
      if (this.eventTargetEl !== el) return;
      this._switchFolderIcon(el);
      this.dispatchEvent('treeview:close treeviewClose', el);
    },
  },
};
</script>
<style scoped></style>
