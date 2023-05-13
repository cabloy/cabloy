export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    ready() {
      return this.atomClassBase && this.actionBaseCurrent;
    },
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
    isOpenAuthScope() {
      return this.atomMain && this.atomMain.roleTypeCode === 6;
    },
    enableRight() {
      if (!this.ready) return false;
      if (this.isOpenAuthScope) return false;
      return this.atomClassBase.enableRight;
    },
    enableRightMine() {
      if (!this.enableRight) return false;
      return this.atomClassBase.enableRight.mine;
    },
    enableRightScopes() {
      if (!this.enableRight) return false;
      return this.atomClassBase.enableRight.role?.scopes;
    },
    action() {
      return this.context.getValue('action');
    },
    value() {
      return this.context.getValue();
    },
    atomClassBase() {
      return this.context.getValue('__atomClassBase');
    },
    actionBaseCurrent() {
      return this.context.getValue('__actionBaseCurrent');
    },
  },
  watch: {
    action: {
      handler(newValue) {
        this.__actionChanged(newValue);
      },
      immediate: false, // true,
    },
  },
  methods: {
    __actionChanged() {
      // this.context.setValue(null);
      // await this.__loadActionSelectOptions();
    },
    onSelectRoleScopes() {},
    _renderRoleRightMine() {
      if (!this.enableRightMine) return null;
      const { parcel } = this.context;
      const propertyMine = {
        ebType: 'toggle',
        ebTitle: 'DataScopeSelfTitle',
      };
      const meta = {
        ebPatch: {
          getValue: () => {
            return this.value === 0;
          },
          setValue: value => {
            if (value) {
              this.context.setValue(0);
            } else {
              this.context.setValue([]);
            }
            return value;
          },
        },
      };
      return (
        <eb-list-item-validate
          parcel={parcel}
          dataKey="__groupAuthorizationDataScopeMine"
          property={propertyMine}
          meta={meta}
        ></eb-list-item-validate>
      );
    },
    _renderRoleRightScopes() {
      if (!this.enableRightScopes) return null;
      // adjust
      if (!this.enableRightMine && this.value === 0) {
        this.context.setValue([]);
      }
      if (this.value === 0) return null;
      // render
      return (
        <f7-list-item title={this.$text('DataScopeTitle')} link="#" onClick={this.onSelectRoleScopes}>
          <div slot="after">{this.scopeTitle}</div>
        </f7-list-item>
      );
    },
  },
  render() {
    if (!this.enableRight) return null;
    const domRoleRightMine = this._renderRoleRightMine();
    const domRoleRightScopes = this._renderRoleRightScopes();
    return (
      <div>
        <eb-list-item title={this.$text('DataScope')} group-title></eb-list-item>
        {domRoleRightMine}
        {domRoleRightScopes}
      </div>
    );
  },
};
