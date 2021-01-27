export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    onPerformResources(event, resourceType) {
      const resourcesShowOld = this.$meta.vueLayout.layoutConfig.toolbar.buttons;
      const checkedAtomStaticKeys = resourcesShowOld.map(item => this._resourceFullName(item));
      this.$view.navigate(`/a/basefront/resource/select?resourceType=${resourceType}`, {
        target: '_self',
        context: {
          params: {
            multiple: true,
            fixed: 'disabled',
            checkedAtomStaticKeys,
          },
          callback: (code, nodes) => {
            if (code === 200) {
              this._switchResources(nodes, resourceType);
            }
          },
        },
      });
    },
    _switchPolicy(resourceType) {
      if (resourceType === 'a-layoutmobile:button') {
        return {
          open: resource => {
            this.$meta.vueLayout.openButton(resource);
          },
          close: resource => {
            this.$meta.vueLayout.closeButton(resource);
          },
        };
      }
    },
    _switchResources(nodes, resourceType) {
      const policy = this._switchPolicy(resourceType);
      // new
      let resourcesShowNew;
      if (!nodes || nodes.length === 0) {
        resourcesShowNew = [];
      } else {
        resourcesShowNew = nodes.map(node => {
          return { atomStaticKey: node.data.atomStaticKey };
        });
      }
      // old
      const resourcesShowOld = this.$meta.vueLayout.layoutConfig.toolbar.buttons.concat();
      // open
      for (const resource of resourcesShowNew) {
        const index = resourcesShowOld.findIndex(item => this._resourceFullName(item) === resource.atomStaticKey);
        if (index === -1) {
          policy.open(resource);
        }
      }
      // close
      for (const resource of resourcesShowOld) {
        // dynamic
        if (!resource.atomStaticKey && !resource.module) continue;
        // check
        const index = resourcesShowNew.findIndex(item => item.atomStaticKey === this._resourceFullName(resource));
        if (index === -1) {
          policy.close(resource);
        }
      }
    },
    _resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
    onPerformReset() {
      this.$meta.vueLayout.reset();
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('ViewLayout')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link propsOnPerform={() => this.onPerformReset()}>{this.$text('Reset')}</eb-link>
          </f7-nav-right>
        </eb-navbar>
        <f7-list>
          <eb-list-item title={this.$text('Tabbar Buttons')} link="#" propsOnPerform={event => this.onPerformResources(event, 'a-layoutmobile:button')}></eb-list-item>
        </f7-list>
      </eb-page>
    );
  },
};
