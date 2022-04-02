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
      if (this.layoutManager.base_user.anonymous) {
        await this.layoutManager.$view.dialog.confirm(this.$text('Please Sign In'));
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
      await this._loopProviders(async provider => {
        // findItem
        const res = this._callMethodProvider(provider, 'findItem', atomId);
        if (!res) return;
        // item: support tree provider
        const { items, index, item } = res;
        const params = this.layoutManager.base_prepareSelectParams({ setOrder: false });
        const star = params.options.star;
        if (star) {
          // switch
          if (data.star === 0 && index !== -1) {
            this._callMethodProvider(provider, 'spliceItem', { items, index, item });
          } else if (data.star === 1 && index === -1) {
            this._callMethodProvider(provider, 'onPageRefresh');
          } else if (index !== -1) {
            items[index].star = data.star;
          }
        } else {
          // just change
          if (item) {
            item.star = data.star;
          } else {
            if (index !== -1) {
              items[index].star = data.star;
            }
          }
        }
      });
    },
  },
};
