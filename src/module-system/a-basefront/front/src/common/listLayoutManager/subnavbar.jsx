export default {
  data() {
    return {
      subnavbar: {
        enable: false,
        render: false, // will render in title if true
      },
    };
  },
  methods: {
    subnavbar_policyDefault() {
      const { enable, render } = this.subnavbar_policyDefaultCalc();
      this.subnavbar.enable = enable;
      this.subnavbar.render = render;
    },
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
