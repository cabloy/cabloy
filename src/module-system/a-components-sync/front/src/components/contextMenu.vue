<script>
export default {
  name: 'eb-context-menu',
  render(c) {
    const slotLeft = this.$slots.left;
    const slotRight = this.$slots.right;
    if (this.$device.desktop) {
      // children
      const children = [];
      if (slotLeft) {
        for (const vnode of slotLeft[0].children) {
          children.push(this.vNodeItemDesktop(c, vnode));
        }
      }
      if (slotLeft && slotRight) {
        children.push(c('f7-list-item', { attrs: { divider: true } }));
      }
      if (slotRight) {
        for (const vnode of slotRight[0].children) {
          children.push(this.vNodeItemDesktop(c, vnode));
        }
      }
      // list
      const list = c('f7-list', { attrs: { inset: true } }, children);
      // ready
      let ready;
      if (slotLeft) ready = slotLeft[0].data.attrs.ready;
      if (ready === undefined && slotRight) ready = slotRight[0].data.attrs ? slotRight[0].data.attrs.ready : undefined;
      // popover
      const attrs = {};
      if (ready !== undefined) attrs.ready = ready;
      return c('eb-popover', { attrs }, [list]);
    }

    // mobile
    const children = [];
    if (slotLeft) children.push(this.vNodeSlotMobile(c, slotLeft));
    if (slotRight) children.push(this.vNodeSlotMobile(c, slotRight));
    return c('div', children);
  },
  methods: {
    vNodeItemDesktop(c, vnode) {
      if (!vnode.data) return vnode;
      const attrs = this.$utils.extend({}, vnode.data.attrs);
      if (attrs.link === undefined) attrs.link = '#';
      attrs.popoverClose = true;
      delete attrs.color;
      return c('eb-list-item', { attrs }, vnode.children);
    },
    vNodeItemMobile(c, vnode) {
      if (!vnode.data) return vnode;
      const attrs = this.$utils.extend({}, vnode.data.attrs);
      return c('eb-swipeout-button', { attrs }, vnode.children);
    },
    vNodeSlotMobile(c, slot) {
      const children = [];
      for (const vnode of slot[0].children) {
        children.push(this.vNodeItemMobile(c, vnode));
      }
      const attrs = this.$utils.extend({}, slot[0].data.attrs);
      attrs[slot[0].data.slot] = true;
      return c('eb-swipeout-actions', { attrs }, children);
    },
  },
};

</script>
<style scoped>
</style>
