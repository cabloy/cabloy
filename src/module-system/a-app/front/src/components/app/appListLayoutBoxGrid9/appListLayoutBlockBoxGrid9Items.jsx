export default {
  data() {
    return {
      supportSingle: true,
    };
  },
  methods: {
    async init_categoriesAll() {
      this.categoryTree = await this.$store.dispatch('a/base/getCategories', {
        atomClass: this.layoutManager.base_atomClassApp,
      });
    },
    onItemClick(event, item) {
      const appKey = item.atomStaticKey;
      this.layoutManager.$meta.vueLayout.app_openHome({ appKey, force: false });
    },
    _renderGroup(group) {
      const children = [];
      for (const item of group.items) {
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
  },
};
