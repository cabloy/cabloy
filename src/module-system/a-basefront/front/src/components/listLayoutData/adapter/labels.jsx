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
        await this.layoutManager.$view.dialog.confirm(this.$text('Please Sign In'));
        // login
        this.$meta.vueLayout.openLogin();
        return;
      }
      // navigate
      const navigateOptions = {};
      if (this.layoutManager.$view.inPanel()) {
        navigateOptions.target = '_self';
      }
      this.layoutManager.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, navigateOptions);
      // swipeoutClose
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async labels_onChanged(data) {
      const atomId = data.key.atomId;
      // loop
      await this._loopProviders(async provider => {
        // findItem
        const res = this._callMethodProvider(provider, 'findItem', atomId);
        if (!res) return;
        // item: support tree provider
        const { items, index, item } = res;
        const params = this.layoutManager.base_prepareSelectParams({ setOrder: false });
        const label = params.options.label;
        if (label) {
          // switch
          const exists = data.labels.indexOf(String(label)) > -1;
          if (!exists && index !== -1) {
            this._callMethodProvider(provider, 'spliceItem', items, index);
          } else if (exists && index === -1) {
            this._callMethodProvider(provider, 'onPageRefresh');
          } else if (index !== -1) {
            items[index].labels = JSON.stringify(data.labels);
          }
        } else {
          // just change
          if (item) {
            item.labels = JSON.stringify(data.labels);
          } else {
            if (index !== -1) {
              items[index].labels = JSON.stringify(data.labels);
            }
          }
        }
      });
    },
  },
};
