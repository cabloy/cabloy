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
      categoryTree: null,
    };
  },
  computed: {
    appMenuGroups() {
      return this.layoutManager.data_tools_groupItems({
        categories: this.categoryTree,
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
      this.layoutConfigKeyOpened = `appMenu.${appKey}.render.list.layouts.list.opened`;
      this.accordionItemOpened = this.layoutManager.layout.layoutConfig[this.layoutConfigKeyOpened] || 0;
    },
    async init_categoriesAll() {
      this.categoryTree = await this.$store.dispatch('a/base/getCategoryTreeResource', { resourceType: 'a-base:menu' });
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
      const appMenuGroups = this.appMenuGroups;
      if (!appMenuGroups) return null;
      const children = [];
      for (let index = 0; index < appMenuGroups.length; index++) {
        children.push(this._renderAccordion(appMenuGroups[index], index));
      }
      return <eb-list accordion-list>{children}</eb-list>;
    },
  },
  render() {
    return <div>{this._renderAccordions()}</div>;
  },
};
