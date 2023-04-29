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
      if (render === undefined || render === null) {
        if (this.subnavbar_policyDefaultCalc_render) {
          render = this.subnavbar_policyDefaultCalc_render();
        }
        if (render === undefined || render === null) {
          render = true;
        }
      }
      // enable
      let enable = subnavbar?.enable;
      if (enable === undefined || enable === null) {
        if (this.subnavbar_policyDefaultCalc_enable) {
          enable = this.subnavbar_policyDefaultCalc_enable();
        }
        if (enable === undefined || enable === null) {
          if (!render) {
            enable = false;
          } else {
            enable = this.$view.size === 'small';
          }
        }
      }
      // ok
      return { enable, render };
    },
  },
};
