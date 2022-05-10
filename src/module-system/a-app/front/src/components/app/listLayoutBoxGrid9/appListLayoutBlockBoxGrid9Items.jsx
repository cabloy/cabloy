const __categoriesInner = ['General', 'Management', 'System'];

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
      accordionItemOpened: 0,
      layoutConfigKeyOpened: null,
      categoriesAll: null,
    };
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
    },
    init_layoutConfig() {
      // accordionItemOpened
      const appKey = this.layoutManager.container.appKey;
      this.layoutConfigKeyOpened = `app.${appKey}.list.layouts.boxGrid9.opened`;
      this.accordionItemOpened = this.layoutManager.layout.layoutConfig[this.layoutConfigKeyOpened] || 0;
    },
    async init_categoriesAll() {
      // categoriesAll
      let categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.layoutManager.base_atomClassApp,
      });
      // 0 -> 1,2,3
      for (const category of categoriesAll) {
        if (category.categorySorting === 0) {
          const index = __categoriesInner.indexOf(category.categoryName);
          if (index > -1) {
            category.categorySorting = index + 1;
          }
        }
      }
      // sort
      categoriesAll = categoriesAll.sort((a, b) => a.categorySorting - b.categorySorting);
      // ok
      this.categoriesAll = categoriesAll;
    },
    onItemClick(event, resource) {
      return this.layoutManager.base_onPerformResource(event, resource);
    },
    onAccordionOpen(event, item) {
      this.accordionItemOpened = item.id;
      // save
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront',
        key: this.layoutConfigKeyOpened,
        value: item.id,
      });
    },
    _renderCategories(categoryParent) {
      const children = [];
      if (!categoryParent.children) return children;
      for (const category of categoryParent.children) {
        const domListItems = this._renderListItems(category);
        const domCategory = (
          <f7-list-group key={category.id}>
            <f7-list-item group-title title={category.categoryNameLocale}></f7-list-item>
            {domListItems}
          </f7-list-group>
        );
        children.push(domCategory);
      }
      return children;
    },
    _renderResources(categoryParent) {
      const children = [];
      const resources = this.layoutManager.base.resourcesArrayAll.filter(
        item => item.atomCategoryId === categoryParent.id
      );
      for (const resource of resources) {
        const domResource = (
          <eb-list-item
            class="item"
            key={resource.atomId}
            link="#"
            title={resource.atomNameLocale}
            propsOnPerform={event => this.onItemClick(event, resource)}
          ></eb-list-item>
        );
        children.push(domResource);
      }
      return children;
    },
    _renderListItems(categoryParent) {
      if (categoryParent.categoryCatalog === 1) {
        return this._renderCategories(categoryParent);
      }
      return this._renderResources(categoryParent);
    },
    _renderAccordion(item, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domListItems = this._renderListItems(item);
      const domAccordionContent = (
        <f7-accordion-content>
          <eb-list inset>{domListItems}</eb-list>
        </f7-accordion-content>
      );
      const accordionItemOpened =
        this.accordionItemOpened === item.id || (this.accordionItemOpened === 0 && index === 0);
      // ok
      return (
        <eb-list-item
          key={item.id}
          accordion-item
          accordion-item-opened={accordionItemOpened}
          onAccordionOpen={event => this.onAccordionOpen(event, item)}
        >
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      if (!this.layoutManager.base_ready) return;
      const items = this.layoutManager.base.treeData;
      const children = [];
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderAccordion(items[index], index));
      }
      return <eb-list accordion-list>{children}</eb-list>;
    },
  },
  render() {
    return <div>{this._renderAccordions()}</div>;
  },
};
