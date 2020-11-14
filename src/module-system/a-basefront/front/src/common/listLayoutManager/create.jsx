export default {
  data() {
    return {
      create: {
        actions: null,
      },
    };
  },
  computed: {
    create_showPopoverActions() {
      return this.create.actions && this.create.actions.length > 0;
    },
  },
  methods: {
    create_loadActions() {
      if (this.container.scene === 'select' || this.container.scene === 'selecting') return;
      if (this.container.atomClass || this.create.actions) return;
      // functionList
      const options = {
        where: { menu: 1, sceneName: 'create' },
        orders: [
          [ 'sorting', 'asc' ],
        ],
      };
      this.$api.post('/a/base/function/list', {
        options,
      }).then(data => {
        this.create.actions = data.list;
      });
    },
    create_onPerformActions(event) {
      const popover = this.$refs.create_popoverActions.$el;
      this.$f7.popover.open(popover, event.currentTarget);
    },
    create_onAction(event, action) {
      let _menu = this.getMenu(action);
      if (!_menu) return;
      if (_menu.action === 'create') {
        action = {
          atomClassId: action.atomClassId,
          module: action.module,
          atomClassName: action.atomClassName,
          atomClassIdParent: action.atomClassIdParent,
        };
        _menu = this.$utils.extend({}, _menu, { targetEl: event.target });
      }
      this.$meta.util.performAction({ ctx: this, action: _menu, item: action });
    },
    create_renderPopoverActions() {
      if (!this.create_showPopoverActions) return null;
      // list
      const children = [];
      for (const action of this.create.actions) {
        children.push(
          <eb-list-button key={action.id} popoverClose propsOnPerform={event => this.create_onAction(event, action)}>{action.titleLocale}</eb-list-button>
        );
      }
      return (
        <f7-popover ref="create_popoverActions">
          <f7-list inset>
            {children}
          </f7-list>
        </f7-popover>
      );
    },
    create_renderActions() {
      if (this.container.atomClass) return;
      if (!this.create_showPopoverActions) return;
      return (
        <eb-link iconMaterial="add" propsOnPerform={event => this.create_onPerformActions(event)}></eb-link>
      );
    },
  },
};
