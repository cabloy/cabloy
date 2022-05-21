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
      return {};
    },
    methods: {
      async onInit() {},
      onPerformSettingItem(event, item) {
        let action;
        if (item.validator) {
          action = {
            actionModule: 'a-settings',
            actionPath: `/a/settings/instance/edit?module=${item.module}`,
          };
        } else {
          action = item;
        }
        // performAction
        return this.$meta.util.performAction({ ctx: this, action, item });
      },
      onGroupItems({ groups }) {
        const items = [];
        for (const item of this.settingsInstance) {
          const module = this.getModule(item.module);
          items.push({
            atomId: item.module,
            atomNameLocale: module.titleLocale,
            resourceIcon: module.icon,
            onPerform: event => this.onPerformSettingItem(event, item),
          });
        }
        groups.push({
          id: 10000,
          categoryName: 'Settings',
          categoryNameLocale: this.$text('Settings'),
          items,
        });
        return groups;
      },
      _renderCategoryTree() {
        const options = {
          props: {
            atomClass: {
              module: 'a-cms',
              atomClassName: 'article',
            },
            language: this.layoutManager.base_appLanguageCurrent,
            categoryIdStart: 0,
            multiple: false,
            catalogOnly: false,
            leafOnly: true,
            checkbox: false,
          },
          on: {
            // nodeChange: this.onNodeChange,
          },
        };
        return (
          <eb-component
            ref="categorySelect"
            module="a-basefront"
            name="categorySelect"
            options={options}
          ></eb-component>
        );
      },
    },
    render() {
      return this._renderCategoryTree();
    },
  };
}
