export default {
  methods: {
    getViewDirty() {
      const pages = this.routerData.pages;
      for (const page of pages) {
        const pageVue = page.el.__vue__;
        if (pageVue && pageVue.getPageDirty && pageVue.getPageDirty()) return true;
      }
      return false;
    },
    viewDirtyConfirm(cbOk, cbCancel) {
      const _promise = this.dialog.confirm(this.$text('PageDirtyQuitConfirm'));
      if (!cbOk) return _promise;
      _promise
        .then(() => {
          cbOk && cbOk();
        })
        .catch(() => {
          cbCancel && cbCancel();
        });
    },
  },
};
