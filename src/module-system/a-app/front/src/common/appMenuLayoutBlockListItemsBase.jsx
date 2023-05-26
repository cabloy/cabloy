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
      expandAll: true,
      accordionItemOpened: 0,
      layoutConfigKeyOpened: null,
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
  },
  created() {
    this.init();
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    async init() {
      this.init_layoutConfig();
      await this.init_categoriesAll();
      if (this.onInit) {
        await this.onInit();
      }
      this.init_preloadModules();
      this.ready = true;
    },
    init_preloadModules() {
      const appKey = this.layoutManager.container.appKey;
      this.$store.dispatch('a/app/preloadModules', { appKey });
    },
    init_layoutConfig() {
      // accordionItemOpened
      const appKey = this.layoutManager.container.appKey;
      const layoutCurrent = this.layoutManager.layout.current;
      this.layoutConfigKeyOpened = `appMenu.${appKey}.render.list.layouts.${layoutCurrent}.opened`;
      this.accordionItemOpened = this.layoutManager.layout.layoutConfig[this.layoutConfigKeyOpened] || 0;
    },
    async init_categoriesAll() {
      const appKey = this.layoutManager.container.appKey;
      this.categoryTree = await this.$store.dispatch('a/base/getCategoryTreeResourceMenu', {
        resourceType: 'a-base:menu',
        appKey,
      });
    },
    getGroups() {
      return this.groups;
    },
    onRenderGroup(group) {
      return this._renderGroup(group);
    },
    onItemClick(event, item) {
      if (item.onPerform) {
        return item.onPerform(event, item);
      }
      return this.layoutManager.base_onPerformResource(event, item);
    },
    onAccordionOpen(event, group) {
      if (this.expandAll) return;
      this.accordionItemOpened = group.id;
      // save
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront',
        key: this.layoutConfigKeyOpened,
        value: group.id,
      });
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
      groups = groups.filter(item => !item.items || item.items.length > 0);
      // ok
      return groups;
    },
    _adjustCategorySorting(group, categoriesTop) {
      if (group.categorySorting > 0) return group.categorySorting;
      const index = categoriesTop.indexOf(group.categoryName);
      if (index === -1) return group.categorySorting;
      return index - categoriesTop.length;
    },
    _renderGroup(group) {
      const children = [];
      for (const item of group.items) {
        let domItem;
        if (!item) {
          domItem = <f7-list-item divider></f7-list-item>;
        } else {
          const devResourceKey = this.$meta.config.env === 'development' ? item.atomStaticKey : null;
          domItem = (
            <eb-list-item
              class="item item-after-display-none item-line-height-compact"
              key={item.atomId}
              data-dev-resource-key={devResourceKey}
              link="#"
              title={item.atomNameLocale}
              propsOnPerform={event => this.onItemClick(event, item)}
            >
              <f7-icon slot="media" f7={item.resourceIcon}></f7-icon>
            </eb-list-item>
          );
        }
        children.push(domItem);
      }
      return <eb-list inset>{children}</eb-list>;
    },
    _renderAccordion(group, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{group.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domGroup = this.onRenderGroup(group);
      const domAccordionContent = <f7-accordion-content>{domGroup}</f7-accordion-content>;
      let accordionItemOpened;
      if (this.expandAll) {
        accordionItemOpened = true;
      } else {
        accordionItemOpened = this.accordionItemOpened === group.id || (this.accordionItemOpened === 0 && index === 0);
      }
      // ok
      return (
        <eb-list-item
          key={group.id}
          accordion-item
          accordion-item-opened={accordionItemOpened}
          onAccordionOpen={event => this.onAccordionOpen(event, group)}
        >
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      const groups = this.getGroups();
      if (!groups) return null;
      const children = [];
      // single
      if (this.supportSingle && groups.length === 1) {
        return this.onRenderGroup(groups[0]);
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
    _renderUnclassifiedTip() {
      const appKey = this.layoutManager.container.appKey;
      if (appKey !== 'a-appbooster:appUnclassified') return null;
      return (
        <ul>
          <li>
            {this.$text('AppUnclassifiedOptionsTip1_Desp')}
            <f7-link external={true} target="_blank" href={this.$text('AppUnclassifiedOptionsTip1_LinkURL')}>
              {this.$text('AppUnclassifiedOptionsTip1_LinkTitle')}
            </f7-link>
          </li>
          <li>
            {this.$text('AppUnclassifiedOptionsTip2_Desp')}
            <f7-link external={true} target="_blank" href={this.$text('AppUnclassifiedOptionsTip2_LinkURL')}>
              {this.$text('AppUnclassifiedOptionsTip2_LinkTitle')}
            </f7-link>
          </li>
        </ul>
      );
    },
    renderItems() {
      if (!this.ready) return null;
      return (
        <div>
          {this._renderAccordions()}
          {this._renderUnclassifiedTip()}
        </div>
      );
    },
  },
  render() {
    return this.renderItems();
  },
};
