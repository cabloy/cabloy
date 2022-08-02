// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebAppMenuLayoutBlockListItemsBase =
    Vue.prototype.$meta.module.get('a-app').options.mixins.ebAppMenuLayoutBlockListItemsBase;
  const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
  return {
    mixins: [ebAppMenuLayoutBlockListItemsBase, ebModules],
    data() {
      return {
        settingsInstance: null,
      };
    },
    methods: {
      async onInit() {
        // modules
        await this.$store.dispatch('a/base/getModules');
        // settings
        await this.__loadSettingsInstance();
      },
      async __loadSettingsInstance() {
        try {
          const res = await this.$api.post('/a/settings/settings/instance/list');
          this.settingsInstance = res.list;
        } catch (err) {
          // maybe no right
          this.settingsInstance = [];
        }
      },
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
    },
  };
}
