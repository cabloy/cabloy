export default {
  data() {
    return {
    };
  },
  methods: {
    info_onStarSwitch() {
      const star = this.base.item.star ? 0 : 1;
      return this._info_onStarSwitch(star);

    },
    _info_onStarSwitch(star) {
      const item = this.base.item;
      // anonymous
      if (this.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
      });
    },
    info_rendActionsLeft() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // switch select
      children.push(
        <eb-link iconMaterial={item.star ? 'star' : 'star_border'} propsOnPerform={this.info_onStarSwitch}></eb-link>
      );
      children.push(
        <eb-link><f7-badge>sss</f7-badge><f7-badge>sss</f7-badge></eb-link>
      );

      return children;
    },
    info_rendActionsRight() {

    },
  },
};
