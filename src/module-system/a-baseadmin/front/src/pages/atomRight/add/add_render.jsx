export default {
  methods: {
    _renderNavbar() {
      let domButtonSubmit;
      if (this.actionCurrent) {
        domButtonSubmit = <eb-link ref="buttonSubmit" iconF7="::save" propsOnPerform={this.onSave}></eb-link>;
      }
      return (
        <eb-navbar large largeTransparent title={this.getPageTitle('New Authorization')} eb-back-link="Back">
          <f7-nav-right>{domButtonSubmit}</f7-nav-right>
        </eb-navbar>
      );
    },
    _renderAreaScopeGroup() {
      if (this.isOpenAuthScope || !this.areaScopeEnable) return null;
      const areaScopeMeta = this.areaScopeMeta;
      const children = [];
      for (const key in areaScopeMeta.schemas) {
        children.push(<eb-list-item-validate key={key} dataKey={key}></eb-list-item-validate>);
      }
      return (
        <f7-list-group>
          <f7-list-item title={this.$text('AreaScope')} group-title></f7-list-item>
          {children}
        </f7-list-group>
      );
    },
    _renderList() {
      if (!this.ready) return null;
      //
      let domAtomAction;
      if (this.atomClass) {
        domAtomAction = (
          <f7-list-item
            smartSelect
            title={this.$text('Atom Action')}
            smartSelectParams={{ openIn: 'page', closeOnSelect: true }}
          >
            <eb-select name="actionName" vModel={this.actionName} options={this.actionSelectOptions}></eb-select>
          </f7-list-item>
        );
      }
      //
      let domScopeSelf;
      if (!this.isOpenAuthScope && this.scopeSelfEnable) {
        domScopeSelf = (
          <f7-list-item title={this.$text('DataScopeSelfTitle')}>
            <eb-toggle vModel={this.scopeSelf}></eb-toggle>
          </f7-list-item>
        );
      }
      //
      let domScope;
      if (!this.isOpenAuthScope && this.scopeEnable) {
        domScope = (
          <f7-list-item title={this.$text('DataScopeTitle')} link="#" onClick={this.onSelectScope}>
            <div slot="after">{this.scopeTitle}</div>
          </f7-list-item>
        );
      }

      return (
        <eb-validate ref="validate" auto={false} data={this.areaScopeData} meta={{ schema: this.areaScopeSchema }}>
          <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
            <f7-list-group>
              <f7-list-item title={this.$text('AuthorizationObjective')} group-title></f7-list-item>
              <f7-list-item title={this.$text('Atom Class')} link="#" onClick={this.onSelectAtomClass}>
                <div slot="after">{this.atomClass && this.atomClass.title}</div>
              </f7-list-item>
              {domAtomAction}
            </f7-list-group>
            <f7-list-group>
              <f7-list-item title={this.$text('DataScope')} group-title></f7-list-item>
              {domScopeSelf}
              {domScope}
            </f7-list-group>
            {this._renderAreaScopeGroup()}
          </eb-list>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <eb-page>
        {this._renderNavbar()}
        {this._renderList()}
      </eb-page>
    );
  },
};
