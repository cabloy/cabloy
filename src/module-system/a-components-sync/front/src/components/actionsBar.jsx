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
    _render_swipeout_actions(direction, actions) {
      const domActions = [];
      if (actions && actions.length > 0) {
        for (const action of actions) {
          domActions.push(
            <eb-swipeout-button
              key={action.key}
              close
              color={action.color}
              propsOnPerform={event => action.onPerform(event)}
            >
              <f7-icon color={action.icon.color} f7={action.icon.f7}></f7-icon>
              {action.title}
            </eb-swipeout-button>
          );
        }
      }
      return (
        <eb-swipeout-actions side={direction} ready={!!actions}>
          {domActions}
        </eb-swipeout-actions>
      );
    },
    _render_swipeout() {
      const domLeft = this._render_swipeout_actions('left', this.left);
      const domRight = this._render_swipeout_actions('right', this.right);
      return (
        <div>
          {domLeft}
          {domRight}
        </div>
      );
    },
    _render_menu_actions(direction, actions) {
      if (!actions || actions.length === 0) return null;
      const domActions = [];
      for (const action of actions) {
        domActions.push(
          <eb-list-item key={action.key} link="#" popoverClose propsOnPerform={event => action.onPerform(event)}>
            <f7-icon slot="media" color={action.icon.color} f7={action.icon.f7}></f7-icon>
            {action.title}
          </eb-list-item>
        );
      }
      return domActions;
    },
    _render_menu() {
      const ready = !!this.right;
      let children = [];
      const domLeft = this._render_menu_actions('left', this.left);
      const domRight = this._render_menu_actions('right', this.right);
      const domMore = this._render_menu_actions('more', this.more);
      if (domLeft) {
        children = children.concat(domLeft);
      }
      if (domLeft && (domRight || domMore)) {
        children.push(<f7-list-item divider></f7-list-item>);
      }
      if (domRight) {
        children = children.concat(domRight);
      }
      if (domRight && domMore) {
        children.push(<f7-list-item divider></f7-list-item>);
      }
      if (domMore) {
        children = children.concat(domMore);
      }
      return (
        <eb-popover ready={ready}>
          <f7-list inset>{children}</f7-list>
        </eb-popover>
      );
    },
    _render_toolbar() {
      const ready = !!this.right;
      return (
        <eb-popover ready={ready}>
          <f7-toolbar>
            <eb-link iconF7="::person"></eb-link>
          </f7-toolbar>
        </eb-popover>
      );
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
