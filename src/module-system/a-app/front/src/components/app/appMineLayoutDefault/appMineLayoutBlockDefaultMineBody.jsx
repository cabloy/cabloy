export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      resourceType: 'a-base:mine',
      treeData: null,
      resourcesArrayAll: null,
    };
  },
  computed: {
    ready() {
      return this.treeData && this.resourcesArrayAll;
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: this.resourceType,
      });
      this.treeData = await this.$store.dispatch('a/base/getCategoryTreeResource', { resourceType: this.resourceType });
    },
    onPerformMineItem(event, mineItem) {
      const resourceConfig = JSON.parse(mineItem.resourceConfig);
      const action = this.$utils.extend({}, resourceConfig, {
        targetEl: event.currentTarget,
        navigateOptions: { target: '_self' },
      });
      return this.$meta.util.performAction({ ctx: this.layoutManager, action, item: null });
    },
    __getMineItemsOfCategory(category) {
      return this.resourcesArrayAll.filter(item => item.atomCategoryId === category.id);
    },
    renderStats(mineItem) {
      const resourceConfig = JSON.parse(mineItem.resourceConfig);
      const stats = resourceConfig.stats;
      if (!stats) return;
      if (stats.color === 'auto') {
        return <eb-stats-color stats_params={stats.params}></eb-stats-color>;
      }
      return <eb-stats stats_params={stats.params} stats_color={stats.color}></eb-stats>;
    },
    renderMineItems(category) {
      const children = [];
      const mineItems = this.__getMineItemsOfCategory(category);
      for (const mineItem of mineItems) {
        children.push(
          <eb-list-item
            key={mineItem.atomStaticKey}
            link="#"
            title={mineItem.atomNameLocale}
            propsOnPerform={event => this.onPerformMineItem(event, mineItem)}
          >
            <div slot="after">{this.renderStats(mineItem)}</div>
          </eb-list-item>
        );
      }
      return children;
    },
    renderList() {
      if (!this.ready) return;
      if (this.layoutManager.base_user.anonymous) return null;
      const children = [];
      for (const category of this.treeData) {
        children.push(
          <f7-list-group key={category.id}>
            <f7-list-item group-title title={category.categoryNameLocale}></f7-list-item>
            {this.renderMineItems(category)}
          </f7-list-group>
        );
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return this.renderList();
  },
};
