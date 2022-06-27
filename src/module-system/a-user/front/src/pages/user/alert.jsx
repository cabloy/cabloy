export default {
  data() {
    return {
      ready: false,
      categoryTree: null,
      resourcesArrayAll: null,
    };
  },
  computed: {
    groups() {
      // categoriesTop
      const categoriesTop = ['Atom', 'WorkFlow'];
      // groups
      const groups = this._groupItems({
        categories: this.categoryTree,
        items: this.resourcesArrayAll,
        categoriesTop,
      });
      return groups;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.init_categoriesAll();
      await this.init_resourcesArrayAll();
      this.ready = true;
    },
    async init_categoriesAll() {
      this.categoryTree = await this.$store.dispatch('a/base/getCategoryTreeResource', { resourceType: 'a-base:mine' });
    },
    async init_resourcesArrayAll() {
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: 'a-base:mine',
        appKey: 'a-app:appDefault',
      });
    },
    async onItemClick(event, item) {
      if (item.onPerform) {
        return item.onPerform(event, item);
      }
      const resourceConfig = JSON.parse(item.resourceConfig);
      const options = { navigateOptions: { target: '_self' } };
      const action = this.$utils.extend({}, resourceConfig, { targetEl: event.currentTarget }, options);
      return await this.$meta.util.performAction({ ctx: this, action, item });
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
      groups = groups.filter(item => categoriesTop.includes(item.categoryName));
      // items
      for (const item of items) {
        const groupId = item.atomCategoryId;
        const group = groups.find(item => item.id === groupId);
        if (group) {
          group.items.push(item);
        }
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
        const domItem = (
          <eb-list-item
            class="item"
            key={item.atomId}
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
      return <div>{this._renderAccordions()}</div>;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Todos')} eb-back-link="Back"></eb-navbar>
        {this.renderItems()}
      </eb-page>
    );
  },
};
