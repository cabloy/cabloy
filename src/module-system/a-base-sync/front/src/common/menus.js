export default {
  meta: {
    component: false,
  },
  computed: {
    menusAll() {
      return this.$store.getState('a/base/menus');
    },
  },
  methods: {
    getMenu(menu) {
      if (!this.menusAll) return null;
      return this.menusAll[menu.module][menu.name];
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

