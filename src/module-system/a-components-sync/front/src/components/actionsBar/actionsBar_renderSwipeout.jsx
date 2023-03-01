export default {
  methods: {
    _render_swipeout_actions(direction, actions) {
      const domActions = [];
      if (actions) {
        for (const action of actions) {
          domActions.push(
            <eb-swipeout-button
              key={action.key}
              close
              color={action.color}
              propsOnPerform={event => action.onPerform(event)}
            >
              <f7-icon color={action.icon && action.icon.color} f7={action.icon && action.icon.f7}></f7-icon>
              {action.title}
            </eb-swipeout-button>
          );
        }
        // more
        if (direction === 'right' && this.more && this.more.length > 0) {
          domActions.push(
            <eb-swipeout-button key="__more" color="blue" propsOnPerform={event => this.onPerformShowMore(event)}>
              <f7-icon color="" f7="::more-horiz"></f7-icon>
            </eb-swipeout-button>
          );
        }
      }
      return (
        <eb-swipeout-actions side={direction} ready={this._getReadyForSwipeout(actions)}>
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
  },
};
