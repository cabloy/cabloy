export default {
  data() {
    return {
      userAtomId: parseInt(this.$f7route.query.userAtomId),
      userId: parseInt(this.$f7route.query.userId),
      user: null,
    };
  },
  computed: {
    userKey() {
      return { atomId: this.userAtomId, itemId: this.userId };
    },
  },
  created() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      this.user = await this.$api.post('/a/base/atom/read', { key: this.userKey });
    },
    getPageTitle(titleName) {
      let title = this.$text(titleName);
      if (this.user) title = `${title}: ${this.user.atomName}`;
      return title;
    },
  },
};
