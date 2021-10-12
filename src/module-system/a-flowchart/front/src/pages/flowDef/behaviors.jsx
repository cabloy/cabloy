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
        if (behaviorType.indexOf(':') === -1 || behaviorType === 'a-flow:base') continue;
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
    onItemClick(event, behaviorBase) {
      this.contextCallback(200, behaviorBase);
      this.$f7router.back();
    },
    _getBehaviorMedia(item) {
      // icon
      if (item.icon.material) {
        return <f7-icon color={item.color} material={item.icon.material}></f7-icon>;
      }
      // url
      return (
        <img
          style={{ color: item.color }}
          class="media-node-base-icon"
          src={this.$meta.util.combineFetchStaticPath(item.icon)}
        />
      );
    },
    _renderItem(item) {
      // media
      const domMedia = <div slot="media">{this._getBehaviorMedia(item)}</div>;
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.titleLocale}</div>
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={item.type} link="#" propsOnPerform={event => this.onItemClick(event, item)}>
          {domMedia}
          {domTitle}
        </eb-list-item>
      );
    },
    _renderItems() {
      const children = [];
      for (const item of this.behaviorBases) {
        children.push(this._renderItem(item));
      }
      return children;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Add Behavior')} eb-back-link="Back"></eb-navbar>
        <f7-list>{this._renderItems()}</f7-list>
      </eb-page>
    );
  },
};
