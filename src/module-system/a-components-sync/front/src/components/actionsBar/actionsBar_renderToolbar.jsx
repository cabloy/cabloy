export default {
  methods: {
    _render_action_eb_link(action) {
      return (
        <eb-link
          key={action.key}
          popoverClose={true}
          propsOnPerform={event => action.onPerform(event)}
          iconF7={action.icon && action.icon.f7}
          iconColor={action.icon && action.icon.color}
          iconBadge={action.icon && action.icon.badge}
          color={action.color}
        >
          {action.title}
        </eb-link>
      );
    },
    _render_toolbar_actions(direction, actions) {
      if (!actions) return null;
      const domActions = [];
      for (const action of actions) {
        domActions.push(this._render_action_eb_link(action));
      }
      // show more if empty
      if (direction === 'right' && actions.length === 0) {
        if (this.more) {
          for (const action of this.more) {
            domActions.push(this._render_action_eb_link(action));
          }
        }
        return domActions;
      }
      // more
      if (direction === 'right' && this.more && this.more.length > 0) {
        if (this.more.length === 1) {
          const action = this.more[0];
          domActions.push(this._render_action_eb_link(action));
        } else {
          domActions.push(
            <eb-link
              key="__more"
              popoverClose={false}
              propsOnPerform={event => this.onPerformShowMore(event)}
              iconF7="::more-horiz"
              iconColor=""
            ></eb-link>
          );
        }
      }
      return domActions;
    },
    _render_toolbar() {
      const ready = this._getReadyForMenuToolbar();
      // parts
      const domLeft = this._render_toolbar_actions('left', this.left);
      const domRight = this._render_toolbar_actions('right', this.right);
      // combine
      let children = [];
      if (domLeft) {
        children = children.concat(domLeft);
      }
      if (domRight) {
        children = children.concat(domRight);
      }
      return (
        <eb-popover backdrop={false} ready={ready}>
          <f7-toolbar>{children}</f7-toolbar>
        </eb-popover>
      );
    },
  },
};
