export default {
  methods: {
    _render_menu_actions(direction, actions) {
      if (!actions || actions.length === 0) return null;
      const domActions = [];
      for (const action of actions) {
        const actionColor = action.color;
        const iconColor = (action.icon && action.icon.color) || actionColor;
        domActions.push(
          <eb-list-item
            key={action.key}
            text-color={actionColor}
            link="#"
            popoverClose
            propsOnPerform={event => action.onPerform(event)}
          >
            <f7-icon slot="media" color={iconColor} f7={action.icon && action.icon.f7}></f7-icon>
            <div slot="title">{action.title}</div>
          </eb-list-item>
        );
      }
      return domActions;
    },
    _render_menu() {
      const ready = this._getReadyForMenuToolbar();
      // parts
      const domLeft = this._render_menu_actions('left', this.left);
      const domRight = this._render_menu_actions('right', this.right);
      const domMore = this._render_menu_actions('more', this.more);
      // combine
      let children = [];
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
  },
};
