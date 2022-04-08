export default {
  data() {
    return {
      roleAtomId: parseInt(this.$f7route.query.roleAtomId),
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
    };
  },
  computed: {
    roleKey() {
      return { atomId: this.roleAtomId, itemId: this.roleId };
    },
  },
  created() {
    this.loadRole();
  },
  methods: {
    async loadRole() {
      this.role = await this.$api.post('/a/base/atom/read', { key: this.roleKey });
    },
    getPageTitle(titleName) {
      let title = this.$text(titleName);
      if (this.role) title = `${title}: ${this.role.atomNameLocale || this.role.atomName}`;
      return title;
    },
  },
};
