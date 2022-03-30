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
          <f7-button key={action.name} class="display-flex" outline iconF7={action.icon.f7}>
            {action.titleLocale}
          </f7-button>
        );
      }
      if (children.length === 0) return null;
      return <f7-segmented tag="p">{children}</f7-segmented>;
    },
  },
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
