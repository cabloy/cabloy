export default {
  created() {
    this.$meta.eventHub.$on('atom:star', this.star_onChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.star_onChanged);
  },
  methods: {
    async star_onSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return await this.star_onSwitch2(event, item, star, 'swipeoutClose');
    },
    async star_onSwitch2(event, item, star, swipeoutAction) {
      // anonymous
      if (this.base_user.anonymous) {
        await this.$view.dialog.confirm(this.$text('Please Sign In'));
        // login
        this.$meta.vueLayout.openLogin();
        return;
      }
      // key
      const key = { atomId: item.atomId, itemId: item.itemId };
      //
      const data = await this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      });
      this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
      this.$meta.util[swipeoutAction](event.currentTarget);
    },
    async star_onChanged(data) {
      const atomId = data.key.atomId;
      // loop
      await this.data.adapter._loopProviders(async provider => {
        // findItem
        const bundle = this.data.adapter.findItemProvier(provider, atomId);
        // item: support tree provider
        const { item } = bundle;
        const foundItem = !!item;
        const params = this.base_prepareSelectParams({ setOrder: false });
        const star = params.options.star;
        if (star) {
          // switch
          if (data.star === 0 && foundItem) {
            this.data.adapter._callMethodProvider(provider, 'spliceItem', bundle);
          } else if (data.star === 1 && !foundItem) {
            this.data.adapter._callMethodProvider(provider, 'onPageRefresh');
          } else if (foundItem) {
            this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, {
              ...item,
              star: data.star,
            });
          }
        } else {
          // just change
          this.data.adapter._callMethodProvider(provider, 'replaceItem', bundle, {
            ...item,
            star: data.star,
          });
        }
      });
    },
  },
};
