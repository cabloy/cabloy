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
          <f7-list-item title={this.$text('Scope')}>
            <span class="text-color-gray">{this.$text('Self')}</span>
            <eb-toggle vModel={this.scopeSelf}></eb-toggle>
          </f7-list-item>
        );
      }
      //
      let domScope;
      if (!this.isOpenAuthScope && this.scopeEnable) {
        domScope = (
          <f7-list-item title={this.$text('Scope')} link="#" onClick={this.onSelectScope}>
            <div slot="after">{this.scopeTitle}</div>
          </f7-list-item>
        );
      }
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
          <f7-list-item title={this.$text('Atom Class')} link="#" onClick={this.onSelectAtomClass}>
            <div slot="after">{this.atomClass && this.atomClass.title}</div>
          </f7-list-item>
          {domAtomAction}
          {domScopeSelf}
          {domScope}
        </eb-list>
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
