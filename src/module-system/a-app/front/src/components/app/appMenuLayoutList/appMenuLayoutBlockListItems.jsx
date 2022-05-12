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
    onAccordionOpen(event, group) {
      this.accordionItemOpened = group.id;
      // save
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront',
        key: this.layoutConfigKeyOpened,
        value: group.id,
      });
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
          </eb-list-item>
        );
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
      const domGroup = this._renderGroup(group);
      const domAccordionContent = <f7-accordion-content>{domGroup}</f7-accordion-content>;
      const accordionItemOpened =
        this.accordionItemOpened === group.id || (this.accordionItemOpened === 0 && index === 0);
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
