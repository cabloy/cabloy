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
      const render = true;
      const enable = this.$view.size === 'small';
      // ok
      return { enable, render };
    },
  },
};
