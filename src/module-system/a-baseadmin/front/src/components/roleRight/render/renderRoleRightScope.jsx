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
    value() {
      return this.context.getValue();
    },
    atomClassBase() {
      return this.context.getValue('__atomClassBase');
    },
    actionBaseCurrent() {
      return this.context.getValue('__actionBaseCurrent');
    },
    scopeTitle() {
      const scopeRoles = this.context.getValue('scopeRoles');
      if (!scopeRoles) return null;
      return scopeRoles.map(item => item.roleNameLocale).join(',');
    },
  },
  watch: {},
  methods: {
    onSelectRoleScopes() {},
    _renderRoleRightMine() {
      if (!this.enableRightMine) return null;
      const { parcel, property, validate } = this.context;
      // special check for view mode
      if (validate.readOnly || property.ebReadOnly) {
        if (this.value !== 0) {
          return null;
        }
      }
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
      const { property, validate } = this.context;
      // render for view mode
      if (validate.readOnly || property.ebReadOnly) {
        return (
          <f7-list-item title={this.$text('DataScope')}>
            <div slot="after">{this.scopeTitle}</div>
          </f7-list-item>
        );
      }
      // render for edit mode
      return (
        <f7-list-item title={this.$text('SelectDataScope')} link="#" onClick={this.onSelectRoleScopes}>
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
