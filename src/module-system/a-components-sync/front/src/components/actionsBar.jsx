export default {
  meta: {
    global: true,
  },
  name: 'eb-actions-bar',
  props: {
    // toolbar/swipeout/menu
    mode: {
      type: String,
    },
    left: {
      type: Array,
    },
    right: {
      type: Array,
    },
    more: {
      type: Array,
    },
  },
  methods: {
    getMode() {
      if (this.mode) return this.mode;
      return this.$device.desktop ? 'menu' : 'swipeout';
    },
    async onPerformShowMore(event) {
      if (!this.more) return;
      const actions = this.more;
      // preload icons
      const icons = {};
      for (const action of actions) {
        if (action.icon && action.icon.f7) {
          icons[action.key] = await this.$meta.util.combineIcon({ f7: action.icon.f7 });
        }
      }
      // buttons
      const buttons = [];
      for (const action of actions) {
        buttons.push({
          icon: icons[action.key] || this.$meta.util.emptyIcon,
          text: action.title,
          data: action,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: event.currentTarget,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      // perform
      await button.data.onPerform(event);
    },
    _getReadyForMenuToolbar() {
      let keys = [];
      if (this.left) {
        keys = keys.concat(this.left.map(item => item.key));
      }
      if (this.right) {
        keys = keys.concat(this.right.map(item => item.key));
      }
      if (this.more) {
        keys = keys.concat(this.more.map(item => item.key));
      }
      return keys.join(',');
    },
    _getReadyForSwipeout(actions) {
      return !!actions;
    },
  },
  render() {
    const mode = this.getMode();
    if (mode === 'swipeout') {
      return this._render_swipeout();
    } else if (mode === 'menu') {
      return this._render_menu();
    } else if (mode === 'toolbar') {
      return this._render_toolbar();
    }
    return <div>sssss</div>;
  },
};
