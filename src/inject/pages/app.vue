<script>
let _resizeTimeout = 0;

export default {
  render(c) {
    const children = [];
    // statusbar
    children.push(c('f7-statusbar', { ref: 'statusbar' }));
    // layout options
    const layoutOptions = this.layout ?
      this.$meta.module.get().options.meta.layout[this.layout] : null;
    // layout module
    const $module = layoutOptions ?
      this.$meta.module.get(layoutOptions.module) : null;
    // layout mobile
    if (this.layoutMobile) {
      children.push(c('eb-layout-mobile', {
        ref: 'layoutMobile',
        props: { layoutOptions, $module },
      }));
    }
    // layout pc
    if (this.layoutPC) {
      children.push(c('eb-layout-pc', {
        ref: 'layoutPC',
        props: { layoutOptions, $module },
      }));
    }
    return c('div', children);
  },
  data() {
    return {
      layout: null,
      layoutMobile: false,
      layoutPC: false,
    };
  },
  methods: {
    onF7Ready() {
      this.resize();
    },
    getLayout() {
      if (this.layoutMobile) return this.$refs.layoutMobile;
      if (this.layoutPC) return this.$refs.layoutPC;
    },
    resize() {
      const options = this.$meta.module.get().options;
      // layout
      let layout = window.document.documentElement.clientWidth > options.meta.breakpoint ?
        'pc' : 'mobile';
      if (!options.meta.layout[layout]) {
        layout = layout === 'pc' ? 'mobile' : 'pc';
      }
      // check if switch
      if (this.layout === layout) {
        const component = this.getLayout();
        if (component) component.onResize();
      } else {
        this.layout = layout;
        // layout options
        const layoutOptions = options.meta.layout[this.layout];
        // load module layout
        this.$meta.module.use(layoutOptions.module, module => {
          // set layout component
          this.$options.__proto__.components[`eb-layout-${this.layout}`] = module.options.components.layout;
          // show
          this.layoutMobile = this.layout === 'mobile';
          this.layoutPC = this.layout === 'pc';
        });
      }
    },
  },
  mounted() {
    window.onresize = () => {
      if (_resizeTimeout) return;
      _resizeTimeout = window.setTimeout(() => {
        _resizeTimeout = 0;
        this.resize();
      }, 300);
    };
  },
};

</script>
<style scoped>


</style>
