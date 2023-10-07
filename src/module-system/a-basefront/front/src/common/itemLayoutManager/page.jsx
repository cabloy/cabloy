export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return true;
    },
    page_onGetTitle() {
      const title = this.page_onGetTitle_inner();
      return this.page_getDirtyTitle(title);
    },
    page_onGetTitle_inner() {
      // form action
      if (this.base._formActionBase && this.base.item) {
        const useStoreActionBase = this.$store.useSync('a/base/actionBase');
        return useStoreActionBase.getDialogTitle({
          ctx: this,
          action: this.base._formActionBase,
          item: this.base.item,
        });
      }
      // item
      if (this.base.item) {
        if (this.container.mode === 'edit') {
          return this.base.item.atomName;
        }
        return this.base.item.atomNameLocale || this.base.item.atomName || this.base.item._meta?.atomName;
      }
      // atomClass
      return this.base.atomClassBase.titleLocale;
      // return `${name}: ${this.base.item.atomName}`;
      // title = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
    },
    page_onGetTitleSub() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
