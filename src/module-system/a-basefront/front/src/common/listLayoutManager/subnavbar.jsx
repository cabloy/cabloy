export default {
  data() {
    return {};
  },
  methods: {
    subnavbar_policyDefaultCalc() {
      let enable;
      // render
      const render =
        this.container.atomClass && this.container.scene !== 'select' && this.container.scene !== 'selecting';
      if (!render) {
        enable = false;
      } else {
        enable = this.$view.size === 'small';
      }
      // ok
      return { enable, render };
    },
  },
};
