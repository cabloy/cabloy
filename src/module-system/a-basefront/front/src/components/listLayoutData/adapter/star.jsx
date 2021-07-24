export default {
  methods: {
    async star_onSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return await this.star_onSwitch2(event, item, star, 'swipeoutClose');
    },
    async star_onSwitch2(event, item, star, swipeoutAction) {
      // anonymous
      if (this.layoutManager.base_user.anonymous) {
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
      this.$meta.util[swipeoutAction](event.target);
    },
  },
};
