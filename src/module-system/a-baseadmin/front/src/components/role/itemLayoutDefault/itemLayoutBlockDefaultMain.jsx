export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      roleActions: null,
    };
  },
  computed: {
    roleAtomId() {
      return this.layoutManager.container.atomId;
    },
  },
  created() {
    this._fetchRoleActions();
  },
  methods: {
    async _fetchRoleActions() {
      this.roleActions = await this.$api.post('/a/baseadmin/role/itemActions', {
        key: { atomId: this.roleAtomId },
      });
    },
    _renderToolbar() {
      if (!this.roleActions) return null;
      const children = [];
      for (const action of this.roleActions) {
        children.push(
          <eb-button
            key={action.name}
            outline
            iconF7={action.icon.f7}
            propsOnPerform={event => this.onPerformAction(event, action)}
          >
            {action.titleLocale}
          </eb-button>
        );
      }
      if (children.length === 0) return null;
      return <f7-segmented tag="p">{children}</f7-segmented>;
    },
  },
  onPerformAction(event, action) {
    const method = `onPerformAction_${action.name}`;
    return this[method](event, action);
  },
  onPerformAction_addChildRole(event, action) {},
  render() {
    const domToolbar = this._renderToolbar();
    const domValidate = this.layoutManager.validate_render();
    if (!domToolbar) return domValidate;
    return (
      <div>
        {domToolbar}
        {domValidate}
      </div>
    );
  },
};
