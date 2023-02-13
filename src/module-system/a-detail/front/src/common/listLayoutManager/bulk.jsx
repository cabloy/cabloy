export default {
  data() {
    return {
      bulk: {
        actions: null,
        activeDetailKey: null,
        hoverDetailKey: null,
      },
    };
  },
  created() {
    this.bulk_loadActions();
  },
  methods: {
    async bulk_onAction(event, action) {
      this.$f7.tooltip.hide(event.currentTarget);
      // action
      let _action = this.getDetailAction(action);
      if (!_action) return;
      _action = this.$utils.extend({}, _action, { targetEl: event.currentTarget });
      // item
      const item = {
        atomId: this.container.atomId,
        module: action.module,
        detailClassName: action.detailClassName,
      };
      // performAction
      return await this.$meta.util.performAction({
        ctx: this,
        action: _action,
        item: {
          item,
          meta: {
            flowTaskId: this.container.flowTaskId,
          },
        },
      });
    },
    bulk_loadActions() {
      if (this.bulk.actions) return;
      this.$api
        .post('/a/detail/detail/actionsBulk', {
          flowTaskId: this.container.flowTaskId,
          atomKey: { atomId: this.container.atomId },
          detailClass: this.container.detailClass,
          mode: this.container.mode,
        })
        .then(data => {
          this.bulk.actions = data;
        });
    },
    bulk_renderActionsRight() {
      const children = [];
      if (this.bulk.actions && this.detailActionsAll) {
        for (const action of this.bulk.actions) {
          const _action = this.getDetailAction(action);
          children.push(
            <eb-link
              key={`actionsRight:${_action.name}`}
              iconMaterial={_action.icon && _action.icon.material}
              iconF7={_action.icon && _action.icon.f7}
              tooltip={_action.icon && _action.titleLocale}
              propsOnPerform={event => this.bulk_onAction(event, action)}
            >
              {!_action.icon && _action.titleLocale}
            </eb-link>
          );
        }
      }
      return children;
    },
  },
};
