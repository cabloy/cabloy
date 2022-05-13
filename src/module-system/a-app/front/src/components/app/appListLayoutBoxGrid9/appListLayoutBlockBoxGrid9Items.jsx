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
      return this.layoutManager.data_tools_groupItems({
        categories: this.categoriesAll,
        items: this.layoutManager.data_getItemsAll(),
        categoriesTop: this.blockConfig.categoriesTop,
      });
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
      const layoutCurrent = this.layoutManager.layout.current;
      this.layoutConfigKeyOpened = `appMenu.${appKey}.render.list.layouts.${layoutCurrent}.opened`;
      this.accordionItemOpened = this.layoutManager.layout.layoutConfig[this.layoutConfigKeyOpened] || 0;
    },
    async init_categoriesAll() {
      this.categoriesAll = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.layoutManager.base_atomClassApp,
      });
    },
    onItemClick(event, item) {
      const appKey = item.atomStaticKey;
      this.layoutManager.$meta.vueLayout.app_openHome({ appKey, force: false });
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
    _renderAppGroup(appGroup) {
      const children = [];
      for (const item of appGroup.items) {
        const domItem = (
          <eb-link key={item.atomId} class="box-grid-cell" propsOnPerform={event => this.onItemClick(event, item)}>
            <div class="box-grid-cell-icon">
              <f7-icon f7={item.appIcon} size="24"></f7-icon>
            </div>
            <div class="box-grid-cell-label">{item.atomNameLocale}</div>
          </eb-link>
        );
        children.push(domItem);
      }
      return <div class="eb-box-grid-row">{children}</div>;
    },
    _renderAccordion(appGroup, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{appGroup.categoryNameLocale}</div>
        </div>
      );
      // domAccordionContent
      const domAppGroup = this._renderAppGroup(appGroup);
      const domAccordionContent = <f7-accordion-content>{domAppGroup}</f7-accordion-content>;
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
      // single
      if (appGroups.length === 1) {
        return this._renderAppGroup(appGroups[0]);
      }
      // more
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
