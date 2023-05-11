export default {
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
      categoryTree: null,
      supportSingle: false,
      ready: false,
    };
  },
  computed: {
    groups() {
      // categoriesTop
      let categoriesTop = this.blockConfig.categoriesTop;
      if (!categoriesTop) {
        categoriesTop = this.layoutManager.data_tools_prepareCategoriesTop() || [];
      }
      // groups
      const groups = this._groupItems({
        categories: this.categoryTree,
        items: this.layoutManager.data_getItemsAll(),
        categoriesTop,
      });
      return groups;
    },
    base_appInfoCurrent() {
      return this.layoutManager.base.appInfoCurrent;
    },
  },
  watch: {
    base_appInfoCurrent() {
      if (!this.ready) return;
      if (!this.$meta.vueLayout.started) return;
      this.init_reload();
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeDestroy() {
    this.ready = false;
  },
  methods: {
    async init() {
      this.init_layoutConfig();
      await this.init_reload();
      if (this.onInit) {
        await this.onInit();
      }
      this.ready = true;
    },
    async init_reload() {
      await this.init_categoriesAll();
      await this.init_fetchDataAll();
      this.init_preloadModules();
    },
    init_preloadModules() {
      const appInfoCurrent = this.layoutManager.base.appInfoCurrent;
      const appKey = appInfoCurrent.appKey;
      this.$store.dispatch('a/app/preloadModules', { appKey });
    },
    init_layoutConfig() {},
    async init_categoriesAll() {
      const appInfoCurrent = this.layoutManager.base.appInfoCurrent;
      const appKey = appInfoCurrent.appKey;
      this.categoryTree = await this.$store.dispatch('a/base/getCategoryTreeResourceMenu', {
        resourceType: 'a-base:mine',
        appKey,
      });
    },
    async init_fetchDataAll() {
      await this.layoutManager.page_onRefresh();
    },
    onItemClick(event, item) {
      if (item.onPerform) {
        return item.onPerform(event, item);
      }
      return this.layoutManager.base_onPerformResource(event, item);
    },
    _groupItems({ categories, items, categoriesTop }) {
      if (!categories || !items) return null;
      // groups
      let groups = categories.map(item => {
        return {
          id: item.id,
          categoryName: item.categoryName,
          categoryNameLocale: item.categoryNameLocale,
          categorySorting: item.categorySorting,
          items: [],
        };
      });
      // items
      for (const item of items) {
        const groupId = item.atomCategoryId;
        const group = groups.find(item => item.id === groupId);
        if (group) {
          group.items.push(item);
        }
      }
      // onGroupItems
      if (this.onGroupItems) {
        groups = this.onGroupItems({ groups });
      }
      // sort
      groups = groups.sort((a, b) => {
        const sortingA = this._adjustCategorySorting(a, categoriesTop);
        const sortingB = this._adjustCategorySorting(b, categoriesTop);
        return sortingA - sortingB;
      });
      // filter
      groups = groups.filter(item => item.items.length > 0);
      // ok
      return groups;
    },
    _adjustCategorySorting(group, categoriesTop) {
      if (group.categorySorting > 0) return group.categorySorting;
      const index = categoriesTop.indexOf(group.categoryName);
      if (index === -1) return group.categorySorting;
      return index - categoriesTop.length;
    },
    _renderStats(item) {
      const resourceConfig = JSON.parse(item.resourceConfig);
      const stats = resourceConfig.stats;
      if (!stats) return;
      if (stats.color === 'auto') {
        return <eb-stats-color stats_params={stats.params}></eb-stats-color>;
      }
      return <eb-stats stats_params={stats.params} stats_color={stats.color}></eb-stats>;
    },
    _renderGroup(group) {
      const children = [];
      for (const item of group.items) {
        const devResourceKey = this.$meta.config.env === 'development' ? item.atomStaticKey : null;
        const domItem = (
          <eb-list-item
            class="item"
            key={item.atomId}
            data-dev-resource-key={devResourceKey}
            link="#"
            title={item.atomNameLocale}
            propsOnPerform={event => this.onItemClick(event, item)}
          >
            <f7-icon slot="media" f7={item.resourceIcon}></f7-icon>
            <div slot="after">{this._renderStats(item)}</div>
          </eb-list-item>
        );
        children.push(domItem);
      }
      return <eb-list inset>{children}</eb-list>;
    },
    _renderAccordion(group /* , index*/) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{group.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domGroup = this._renderGroup(group);
      const domAccordionContent = <f7-accordion-content>{domGroup}</f7-accordion-content>;
      const accordionItemOpened = true;
      // ok
      return (
        <eb-list-item key={group.id} accordion-item accordion-item-opened={accordionItemOpened}>
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      const groups = this.groups;
      if (!groups) return null;
      const children = [];
      // single
      if (this.supportSingle && groups.length === 1) {
        return this._renderGroup(groups[0]);
      }
      // more
      for (let index = 0; index < groups.length; index++) {
        children.push(this._renderAccordion(groups[index], index));
      }
      return (
        <eb-list accordion-list class="eb-accordion-list">
          {children}
        </eb-list>
      );
    },
    renderItems() {
      if (!this.ready) return null;
      if (this.layoutManager.base_user.anonymous) return null;
      return <div>{this._renderAccordions()}</div>;
    },
  },
  render() {
    return this.renderItems();
  },
};
