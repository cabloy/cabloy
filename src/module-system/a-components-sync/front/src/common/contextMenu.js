export default {
  mounted() {
    this.$$(this.$el).on('contextmenu', this.onContextMenu);
  },
  beforeDestroy() {
    this.$$(this.$el).off('contextmenu', this.onContextMenu);
  },
  methods: {
    onContextMenu(event) {
      // always stop default behavior
      event.stopPropagation();
      event.preventDefault();

      const popover = this.$$(this.$el).find('.popover');
      if (popover.length === 0) return;

      // finished the event immediately
      this.$nextTick(() => {
        this.$f7.popover.open(popover, this.$el);
        this.$emit('contextmenuOpened', event);
      });
    },
  },
};
