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
  computed: {
    appGroups() {
      //
      if (!this.categoriesAll) return null;
      const items = this.layoutManager.data_getItemsAll();
      if (!items) return null;
      //
      let groups = this.categoriesAll.map(item => {
        return {
          id: item.id,
          categoryName: item.categoryName,
          categoryNameLocale: item.categoryNameLocale,
          items: [],
        };
      });
      for (const item of items) {
        // group
        const groupId = item.atomCategoryId;
        const group = groups.find(item => item.id === groupId);
        if (group) {
          group.items.push(item);
        }
      }
      groups = groups.filter(item => item.items.length > 0);
      // ok
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
    onItemClick(event, item) {
      console.log(item);
      // return this.layoutManager.base_onPerformResource(event, resource);
    },
    onAccordionOpen(event, appGroup) {
      this.accordionItemOpened = appGroup.id;
      // save
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront',
        key: this.layoutConfigKeyOpened,
        value: appGroup.id,
      });
    },
    _renderListItems(appGroup) {
      const children = [];
      for (const item of appGroup.items) {
        const domItem = (
          <eb-list-item
            class="item"
            key={item.atomId}
            link="#"
            title={item.atomNameLocale}
            propsOnPerform={event => this.onItemClick(event, item)}
          ></eb-list-item>
        );
        children.push(domItem);
      }
      return children;
    },
    _renderAccordion(appGroup, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{appGroup.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domListItems = this._renderListItems(appGroup);
      const domAccordionContent = (
        <f7-accordion-content>
          <eb-list inset>{domListItems}</eb-list>
        </f7-accordion-content>
      );
      const accordionItemOpened =
        this.accordionItemOpened === appGroup.id || (this.accordionItemOpened === 0 && index === 0);
      // ok
      return (
        <eb-list-item
          key={appGroup.id}
          accordion-item
          accordion-item-opened={accordionItemOpened}
          onAccordionOpen={event => this.onAccordionOpen(event, appGroup)}
        >
          {domTitle}
          {domAccordionContent}
        </eb-list-item>
      );
    },
    _renderAccordions() {
      const appGroups = this.appGroups;
      if (!appGroups) return null;
      const children = [];
      for (let index = 0; index < appGroups.length; index++) {
        children.push(this._renderAccordion(appGroups[index], index));
      }
      return <eb-list accordion-list>{children}</eb-list>;
    },
  },
  render() {
    return <div>{this._renderAccordions()}</div>;
  },
};
