
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    onPerformHeaderButtons(event, side) {
      const buttonsShowOld = this.$meta.vueLayout.sidebar[side].buttons;
      const checkedAtomStaticKeys = buttonsShowOld.map(item => this._resourceFullName(item));
      this.$view.navigate('/a/basefront/resource/select?resourceType=a-layoutpc:headerButton', {
        target: '_self',
        context: {
          params: {
            multiple: true,
            checkedAtomStaticKeys,
          },
          callback: (code, nodes) => {
            if (code === 200) {
              this._switchButtons(side, nodes);
            }
          },
        },
      });
    },
    _switchButtons(side, nodes) {
      // new
      let buttonsShowNew;
      if (!nodes || nodes.length === 0) {
        buttonsShowNew = [];
      } else {
        buttonsShowNew = nodes.map(node => {
          return { atomStaticKey: node.data.atomStaticKey };
        });
      }
      // old
      const buttonsShowOld = this.$meta.vueLayout.sidebar[side].buttons.concat();
      // open
      for (const button of buttonsShowNew) {
        const index = buttonsShowOld.findIndex(item => this._resourceFullName(item) === button.atomStaticKey);
        if (index === -1) {
          this.$meta.vueLayout.openButton(side, button);
        }
      }
      // close
      for (const button of buttonsShowOld) {
        const index = buttonsShowNew.findIndex(item => item.atomStaticKey === this._resourceFullName(button));
        if (index === -1) {
          this.$meta.vueLayout.closeButton(side, button);
        }
      }
    },
    _resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('ViewLayout')} eb-back-link="Back"></eb-navbar>
        <f7-list>
          <eb-list-item title={this.$text('Header Buttons')} link="#" propsOnPerform={event => this.onPerformHeaderButtons(event, 'top')}></eb-list-item>
          <eb-list-item title={this.$text('Sidebar (Left)')} link="#" eb-href="view/panels?side=left" eb-target="_self"></eb-list-item>
          <eb-list-item title={this.$text('Sidebar (Right)')} link="#" eb-href="view/panels?side=right" eb-target="_self"></eb-list-item>
          <eb-list-item title={this.$text('Statusbar (Left)')} link="#" eb-href="view/panels?side=bottom" eb-target="_self"></eb-list-item>
          <eb-list-item title={this.$text('Statusbar (Right)')} link="#" eb-href="view/sections?side=bottom" eb-target="_self"></eb-list-item>
        </f7-list>
      </eb-page>
    );
  },
};
