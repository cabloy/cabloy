import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      nodeBases: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases;
    },
    diagram() {
      return this.contextParams.diagram;
    },
    nodeBasesGroups() {
      const configGroups = this.$config.flowDef.groups;
      const groups = this.$meta.util.extend([], configGroups);
      for (const group of groups) {
        group.titleLocale = this.$text(group.title);
        group.items = [];
        for (const nodeType in this.nodeBases) {
          if (nodeType.indexOf(':') === -1) continue;
          const nodeBase = this.nodeBases[nodeType];
          if (nodeBase.group === group.name) {
            group.items.push({
              type: nodeType,
              ...nodeBase,
            });
          }
        }
      }
      return groups;
    },
  },
  created() {
    this.__load();
  },
  mounted() {
    this.diagram.$on('diagram:destroy', this.onDiagramDestroy);
  },
  beforeDestroy() {
    this.diagram.$off('diagram:destroy', this.onDiagramDestroy);
  },
  methods: {
    async __load() {
      this.nodeBases = await this.$local.dispatch('getNodeBases');
    },
    onDiagramDestroy() {
      this.$view.close();
    },
    onPerformNode(event, nodeBase) {
      // addNode
      this.diagram.addNode(nodeBase);
      // back
      const inPanel = this.$view.inPanel();
      if (!inPanel) {
        this.$f7router.back();
      }
    },
    _renderNodeMedia({ item }) {
      const material = item.icon.material;
      const f7 = item.icon.f7;
      const url = item.icon.url;
      // icon
      if (material || f7) {
        return <f7-icon slot="media" material={material} f7={f7}></f7-icon>;
      }
      // url
      const iconUrl = this.$meta.util.combineFetchStaticPath(url);
      const iconSrc = this.$meta.util.escapeURL(iconUrl);
      return (
        <div slot="media">
          <img class="media-node-base-icon" src={iconSrc} />
        </div>
      );
    },
    _renderGroupItems({ group }) {
      const children = [];
      for (const item of group.items) {
        const domNodeMedia = this._renderNodeMedia({ item });
        children.push(
          <eb-list-item
            key={item.type}
            title={item.titleLocale}
            link="#"
            propsOnPerform={event => {
              this.onPerformNode(event, item);
            }}
          >
            {domNodeMedia}
          </eb-list-item>
        );
      }
      return children;
    },
    _renderGroups() {
      const children = [];
      for (const group of this.nodeBasesGroups) {
        const items = this._renderGroupItems({ group });
        children.push(
          <f7-list-group key={group.name}>
            <f7-list-item group-title title={group.titleLocale}></f7-list-item>
            {items}
          </f7-list-group>
        );
      }
      return children;
    },
    _renderList() {
      if (!this.ready) return;
      const children = this._renderGroups();
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Add Node')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
