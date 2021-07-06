export default {
  data() {
    return {
      base: {
        ready: false,
        configAtomBase: null,
        configAtom: null,
        config: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready;
    },
    base_user() {
      return this.$store.state.auth.user.op;
    },
    base_flow() {
      return this.container_flowLayoutManager.base_flow;
    },
    base_atom() {
      return this.container_flowLayoutManager.base_atom;
    },
    base_flowOld() {
      return this.container_flowLayoutManager.base_flowOld;
    },
    base_atomClass() {
      return this.container_flowLayoutManager.base_atomClass;
    },
  },
  created() {},
  methods: {},
};
