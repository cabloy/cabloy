export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    onPerformResources(event, side, resourceVar, resourceType) {
      const resourcesShowOld = this.$meta.vueLayout.sidebar[side][resourceVar];
      const checkedAtomStaticKeys = resourcesShowOld.map(item => this._resourceFullName(item));
      this.$view.navigate(`/a/basefront/resource/select?resourceType=${resourceType}`, {
        target: '_self',
        context: {
          params: {
            multiple: true,
            checkedAtomStaticKeys,
          },
          callback: (code, nodes) => {
            if (code === 200) {
              this._switchResources(side, nodes, resourceVar, resourceType);
            }
          },
        },
      });
    },
    _switchPolicy(resourceType) {
      if (resourceType === 'a-layoutpc:button') {
        return {
          open: (side, resource) => {
            this.$meta.vueLayout.openButton(side, resource);
          },
          close: (side, resource) => {
            this.$meta.vueLayout.closeButton(side, resource);
          },
        };
      } else if (resourceType === 'a-layoutpc:panel') {
        return {
          open: (side, resource) => {
            const sceneOptions = this.$utils.extend({}, resource, { side });
            this.$meta.vueLayout.navigate(null, { scene: 'sidebar', sceneOptions });
          },
          close: (side, resource) => {
            this.$meta.vueLayout.closePanel(side, resource);
          },
        };
      }
    },
    _switchResources(side, nodes, resourcesVar, resourceType) {
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
      const resourcesShowOld = this.$meta.vueLayout.sidebar[side][resourcesVar].concat();
      // open
      for (const resource of resourcesShowNew) {
        const index = resourcesShowOld.findIndex(item => this._resourceFullName(item) === resource.atomStaticKey);
        if (index === -1) {
          policy.open(side, resource);
        }
      }
      // close
      for (const resource of resourcesShowOld) {
        // dynamic
        if (!resource.atomStaticKey && !resource.module) continue;
        // check
        const index = resourcesShowNew.findIndex(item => item.atomStaticKey === this._resourceFullName(resource));
        if (index === -1) {
          policy.close(side, resource);
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
        <eb-navbar large largeTransparent title={this.$text('ViewLayout') + ' TBD'} eb-back-link="Back"></eb-navbar>
        <f7-list>
          <eb-list-item title={this.$text('Header Buttons')} link="#" propsOnPerform={event => this.onPerformResources(event, 'top', 'buttons', 'a-layoutpc:button')}></eb-list-item>
          <eb-list-item title={this.$text('Sidebar (Left)')} link="#" propsOnPerform={event => this.onPerformResources(event, 'left', 'panels', 'a-layoutpc:panel')}></eb-list-item>
          <eb-list-item title={this.$text('Sidebar (Right)')} link="#" propsOnPerform={event => this.onPerformResources(event, 'right', 'panels', 'a-layoutpc:panel')}></eb-list-item>
          <eb-list-item title={this.$text('Statusbar (Left)')} link="#" propsOnPerform={event => this.onPerformResources(event, 'bottom', 'panels', 'a-layoutpc:panel')}></eb-list-item>
          <eb-list-item title={this.$text('Statusbar (Right)')} link="#" propsOnPerform={event => this.onPerformResources(event, 'bottom', 'buttons', 'a-layoutpc:button')}></eb-list-item>
        </f7-list>
      </eb-page>
    );
  },
};
