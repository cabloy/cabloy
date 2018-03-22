<script>
let _resizeTimeout = 0;

export default {
  render(c) {
    const children = [];
    // statusbar
    children.push(c('f7-statusbar', { ref: 'statusbar' }));
    // layout options
    const layoutOptions = this.layout ?
      this.$meta.module.get().options.meta.layout.items[this.layout] : null;
    const layoutComponent = layoutOptions ?
      this.$meta.module.get(layoutOptions.module).options.meta.layout : null;
    // layout
    if (layoutComponent) {
      children.push(c(layoutComponent, {
        ref: 'layout',
        props: { layoutOptions },
      }));
    }
    return c('div', children);
  },
  data() {
    return {
      layout: null,
    };
  },
  methods: {
    onF7Ready() {
      this.resize();
    },
    getLayout() {
      return this.$refs.layout;
    },
    resize() {
      const options = this.$meta.module.get().options;
      // layout
      let layout = window.document.documentElement.clientWidth > options.meta.layout.breakpoint ?
        'pc' : 'mobile';
      if (!options.meta.layout.items[layout]) {
        layout = layout === 'pc' ? 'mobile' : 'pc';
      }
      // check if switch
      if (this.layout === layout) {
        const component = this.getLayout();
        if (component) component.onResize();
      } else {
        // load module layout
        this.$meta.module.use(options.meta.layout.items[layout].module, () => {
          // ready
          this.layout = layout;
        });
      }
    },
    reload() {
      const layout = this.layout;
      this.layout = null;
      this.$nextTick(() => {
        // clear state
        this.$Framework7.history.state = null;
        // clear router history
        this.$meta.util.clearRouterHistory();
        // clear hash url
        history.replaceState(null, '', location.href.split('#')[0]);
        // restore layout
        this.layout = layout;
      })
    }
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
