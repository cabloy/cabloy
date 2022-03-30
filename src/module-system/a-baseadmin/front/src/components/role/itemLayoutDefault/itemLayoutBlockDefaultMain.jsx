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
        key: { roleAtomId: this.roleAtomId },
      });
    },
    _renderToolbar() {
      return (
        <f7-segmented tag="p">
          <f7-button class="display-flex" outline iconF7="::add">
            {this.$text('AddChildRole')}
          </f7-button>
          <f7-button class="display-flex" outline iconF7="::group">
            {this.$text('Users')}
          </f7-button>
          <f7-button class="display-flex" outline iconF7=":role:role">
            {this.$text('Includes')}
          </f7-button>
        </f7-segmented>
      );
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
