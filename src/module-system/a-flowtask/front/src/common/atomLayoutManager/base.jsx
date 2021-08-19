export default {
  data() {
    return {
      base: {
        ready: false,
        configAtomBase: null,
        configAtom: null,
        config: null,
        layoutConfig: null,
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
  methods: {
    async base_init() {
      // layoutConfig
      this.base.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    base_getLayoutConfigKeyCurrent() {
      const atomClass = this.base_atomClass;
      const atomClassKey = atomClass ? `${atomClass.module}_${atomClass.atomClassName}` : null;
      return `flowTask.${atomClassKey}.render.atom.layout.current.${this.$view.size}`;
    },
  },
};
