import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    ready() {
      return this.nodeBases;
    },
    diagram() {
      return this.contextParams.diagram;
    },
    behaviorBases() {
      const items = [];
      for (const behaviorType in this.diagram.behaviorBases) {
        if (behaviorType.indexOf(':') === -1) continue;
        const behaviorBase = this.diagram.behaviorBases[behaviorType];
        items.push({
          type: behaviorType,
          ...behaviorBase,
        });
      }
      return items;
    },
  },
  created() {},
  methods: {
    getNodeMedia(item) {
      return this.$meta.util.combineFetchStaticPath(item.icon);
    },
    onPerformNode(event, nodeBase) {
      // addNode
      this.diagram.addNode(nodeBase);
      // back
      this.$f7router.back();
    },
    _renderItems() {},
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Add Behavior')} eb-back-link="Back"></eb-navbar>
        <f7-list></f7-list>
      </eb-page>
    );
  },
};
