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
      if (this.base_user.anonymous) {
        await this.$view.dialog.confirm(this.$text('Please Sign In'));
        // login
        this.$meta.vueLayout.openLogin();
        return;
      }
      // navigate
      const navigateOptions = {};
      if (this.$view.inPanel()) {
        navigateOptions.target = '_self';
      }
      this.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, navigateOptions);
      // swipeoutClose
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async labels_onChanged(data) {
      const atomId = data.key.atomId;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        // findItem
        const bundle = this.data.adapter.findItemProvier(provider, atomId);
        // item: support tree provider
        const { item } = bundle;
        const foundItem = !!item;
        const params = this.base_prepareSelectParams({ setOrder: false });
        const label = params.options.label;
        if (label) {
          // switch
          const exists = data.labels.indexOf(String(label)) > -1;
          if (!exists && foundItem) {
            this.data.adapter._callMethodProvider(provider, 'spliceItem', bundle);
          } else if (exists && !foundItem) {
            this.data.adapter._callMethodProvider(provider, 'onPageRefresh');
          } else if (foundItem) {
            this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, {
              ...item,
              labels: JSON.stringify(data.labels),
            });
          }
        } else {
          // just change
          this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, {
            ...item,
            labels: JSON.stringify(data.labels),
          });
        }
      });
    },
  },
};
