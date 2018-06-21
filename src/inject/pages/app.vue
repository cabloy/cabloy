<script>
import Vue from 'vue';
export default {
  render(c) {
    const children = [];
    // statusbar
    children.push(c('f7-statusbar', { ref: 'statusbar' }));
    // layout
    if (this.layout) {
      children.push(c(this.layout, {
        ref: 'layout',
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
      // hash init
      const hashInit = this.$meta.util.parseHash(location.href);
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      // on resize
      this.$f7.on('resize', this.onResize);
      // auth echo first
      this._authEcho(() => {
        // resize
        this.resize();
      });
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
        this.$meta.module.use(options.meta.layout.items[layout].module, module => {
          this.$options.components[layout] = module.options.components[options.meta.layout.items[layout].component];
          // clear router history
          this.$meta.util.clearRouterHistory();
          // ready
          this.layout = layout;
        });
      }
    },
    reload(ops) {
      ops = ops || { echo: false };
      if (ops.echo) {
        this._authEcho(() => {
          this._reloadLayout();
        });
      } else {
        this._reloadLayout();
      }
    },
    onResize: Vue.prototype.$meta.util.debounce(function() {
      this.resize();
    }, 300),
    login(url) {
      const hashInit = this.$store.state.auth.hashInit;
      this.$store.commit('auth/setHashInit', null);
      if (hashInit) url = `${url}?returnTo=${encodeURIComponent(this.$meta.util.combineHash(hashInit))}`;
      location.assign(url);
    },
    _authEcho(cb) {
      // get auth first
      this.$api.post('/a/base/auth/echo').then(user => {
        this.$store.commit('auth/login', {
          loggedIn: user.agent.anonymous === 0,
          user,
        });
        return cb && cb();
      }).catch(() => {
        return cb && cb();
      });
    },
    _reloadLayout() {
      const layout = this.layout;
      this.layout = null;
      this.$nextTick(() => {
        // clear router history
        this.$meta.util.clearRouterHistory();
        // restore layout
        this.layout = layout;
      })
    },
  },
  beforeDestroy() {
    this.$f7.off('resize', this.onResize);
  },
};

</script>
<style scoped>


</style>
