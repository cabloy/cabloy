// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAppMenuLayoutBlockListItemsBase =
    Vue.prototype.$meta.module.get('a-app').options.mixins.ebAppMenuLayoutBlockListItemsBase;
  return {
    mixins: [ebAppMenuLayoutBlockListItemsBase],
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
      async onItemClick(event, item) {
        const appKey = item.atomStaticKey;
        const appIsolate = item.appIsolate;
        if (!appIsolate) {
          this.layoutManager.$meta.vueLayout.app_openHome({
            view: this.layoutManager.$view,
            appKey,
            force: false,
          });
          return;
        }
        // appIsolate
        const action = {
          actionModule: 'a-app',
          actionComponent: 'actionTools',
          name: 'openApp',
          appKey,
          appIsolate,
          external: true,
          target: '_self',
        };
        return await this.layoutManager.$meta.util.performAction({
          ctx: this.layoutManager,
          action,
          item: null,
        });
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
}
