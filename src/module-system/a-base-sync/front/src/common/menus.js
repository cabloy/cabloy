export default {
  computed: {
    menusAll() {
      return this.$store.getState('a/base/menus');
    },
  },
  methods: {
    getMenu(menu) {
      if (!this.menusAll) return null;
      const menus = this.menusAll[menu.module];
      // by name
      if (menu.name) return menus[ menu.name ];
      // by action
      for (const key in menus) {
        if (menus[key].action === menu.action) return menus[key];
      }
      return null;
    },
    getMenuTitle(menu) {
      const _menu = this.getMenu(menu);
      return _menu ? _menu.titleLocale : null;
    },
  },
  created() {
    this.$store.dispatch('a/base/getMenus');
  },
};

