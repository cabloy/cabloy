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
    info_getLabel(id) {
      if (!this.base_userLabels) return null;
      return this.base_userLabels[id];
    },
    info_rendActionsLeft() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // star
      children.push(
        <eb-link iconMaterial={item.star ? 'star' : 'star_border'} propsOnPerform={this.info_onStarSwitch}></eb-link>
      );
      // labels
      if (item.labels && this.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this.info_getLabel(label);
          children.push(
            <eb-link key={label} text={_label.text} style={ { color: _label.color } }></eb-link>
          );
        }
      }

      return children;
    },
    info_rendActionsRight() {

    },
  },
};
