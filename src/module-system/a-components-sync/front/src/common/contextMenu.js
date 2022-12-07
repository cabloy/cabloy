export default {
  data() {
    return {
      contextmenu_checkPopover: true,
    };
  },
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

      let $el;
      let $popover;
      if (this.contextmenu_checkPopover) {
        $el = this.$el;
        $popover = this.$$($el).find('.popover');
      }

      // finished the event immediately
      this.$nextTick(() => {
        if ($popover && $popover.length > 0) {
          this.$f7.popover.open($popover, $el);
        }
        this.$emit('contextmenuOpened', event);
      });
    },
  },
};
