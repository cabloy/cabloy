export default {
  props: {
    item: { type: Object },
    atomClass: { type: Object },
    atomClassBase: { type: Object },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    const self = this;
    const el = self.$refs.el;
    if (!el) return;
    const dialogParams = {
      el: self.$refs.el,
      backdrop: true,
      closeByBackdropClick: true,
      closeOnEscape: true,
      swipeToClose: true,
    };
    self.$f7ready(() => {
      self.f7Dialog = self.$f7.dialog.create(dialogParams);
    });
  },
  beforeDestroy() {
    const self = this;
    if (self.f7Dialog) self.f7Dialog.destroy();
  },
  methods: {
    open() {
      this.f7Dialog.open();
    },
  },
  render() {
    return (
      <div ref="el" class="dialog">
        <div class="dialog-inner">
          <div class="dialog-title"></div>
          <div>ddd</div>
          <div>ddd</div>
          <div>ddd</div>
          <div>ddd</div>
          <div>ddd</div>
          <div>ddd</div>
        </div>
      </div>
    );
  },
};
