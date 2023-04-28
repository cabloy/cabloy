export default {
  data() {
    return {
      subnavbar: {
        enable: false,
        render: false, // will render in titlebar if true
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
      const subnavbar = this.layout.config.subnavbar;
      // render
      let render = subnavbar?.render;
      if (render === undefined) {
        if (this.subnavbar_policyDefaultCalc_render) {
          render = this.subnavbar_policyDefaultCalc_render();
        }
        if (render === undefined) {
          render = true;
        }
      }
      // enable
      let enable = false;
      if (render) {
        enable = subnavbar?.enable;
        if (enable === undefined) {
          if (this.subnavbar_policyDefaultCalc_enable) {
            enable = this.subnavbar_policyDefaultCalc_enable();
          }
          if (enable === undefined) {
            enable = this.$view.size === 'small';
          }
        }
      }
      // ok
      return { enable, render };
    },
  },
};
