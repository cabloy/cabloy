<script>
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
      resizeTimeout: 0,
    };
  },
  methods: {
    onF7Ready() {
      // hash init
      const hashInit = this.$meta.util.parseHash(location.href);
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      // resize
      this.resize();
      // on resize
      this.$f7.on('resize', this.onResize);
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
          // clear router history
          this.$meta.util.clearRouterHistory();
          // ready
          this.layout = layout;
        });
      }
    },
    reload() {
      const layout = this.layout;
      this.layout = null;
      this.$nextTick(() => {
        // clear router history
        this.$meta.util.clearRouterHistory();
        // restore layout
        this.layout = layout;
      })
    },
    onResize() {
      if (this.resizeTimeout) return;
      this.resizeTimeout = window.setTimeout(() => {
        this.resizeTimeout = 0;
        this.resize();
      }, 300);
    },
    login(url) {
      const hashInit = this.$store.state.auth.hashInit;
      this.$store.commit('auth/setHashInit', null);
      if (hashInit) url = `${url}?returnTo=${encodeURIComponent(this.$meta.util.combineHash(hashInit))}`;
      location.assign(url);
    },
  },
  beforeDestroy() {
    this.$f7.off('resize', this.onResize);
  },
};

</script>
<style scoped>


</style>
