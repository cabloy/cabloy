export default {
  created() {
    this.$meta.eventHub.$on('atom:labels', this.labels_onChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:labels', this.labels_onChanged);
  },
  methods: {
    async labels_onClick(event, item) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
        await this.$view.dialog.confirm(this.$text('Please Sign In'));
        // login
        this.$meta.vueLayout.openLogin();
        return;
      }
      // navigate
      this.layoutManager.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, {
        // target: '_self',
      });
      this.$meta.util.swipeoutClose(event.target);
    },
    labels_onChanged(data) {
      const atomId = data.key.atomId;
      const { items, index } = this.findItem(atomId);
      const params = this.layoutManager.base_prepareSelectParams({ setOrder: false });
      const label = params.options.label;
      if (label) {
        // switch
        const exists = data.labels.indexOf(String(label)) > -1;
        if (!exists && index !== -1) {
          items.splice(index, 1);
        } else if (exists && index === -1) {
          this.onPageRefresh();
        } else if (index !== -1) {
          items[index].labels = JSON.stringify(data.labels);
        }
      } else {
        // just change
        if (index !== -1) {
          items[index].labels = JSON.stringify(data.labels);
        }
      }
    },
  },
};
