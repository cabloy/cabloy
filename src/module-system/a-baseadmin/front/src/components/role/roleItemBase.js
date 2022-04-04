export default {
  data() {
    return {
      roleAtomId: parseInt(this.$f7route.query.roleAtomId),
      roleId: parseInt(this.$f7route.query.roleId),
      role: null,
    };
  },
  created() {
    this.loadRole();
  },
  methods: {
    async loadRole() {
      this.role = await this.$api.post('/a/base/atom/read', { key: { atomId: this.roleAtomId } });
    },
    getPageTitle(titleName) {
      let title = this.$text(titleName);
      if (this.role) title = `${title}: ${this.role.atomNameLocale || this.role.atomName}`;
      return title;
    },
  },
};
