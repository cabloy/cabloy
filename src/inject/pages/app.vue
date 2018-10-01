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
    const app = c('f7-app', {
      staticClass: this.$meta.config.layout.color ? `color-theme-${this.$meta.config.layout.color}` : '',
      props: { params: this.$root.$options.framework7 },
    }, children);
    return c('div', [app]);
  },
  data() {
    return {
      layout: null,
    };
  },
  methods: {
    ready() {
      if (this.$f7.device.ie) {
        this.$f7.dialog.alert('Supports All Modern Browsers Except IE');
        return;
      }
      // check query
      const documentUrl = location.href.split(location.origin)[1];
      if (documentUrl && documentUrl.indexOf('/?') === 0) {
        history.replaceState(null, '', location.origin);
      }
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
      // layout
      const breakpoint = this.$meta.config.layout.breakpoint;
      let layout = window.document.documentElement.clientWidth > breakpoint ? 'pc' : 'mobile';
      if (!this.$meta.config.layout.items[layout]) {
        layout = layout === 'pc' ? 'mobile' : 'pc';
      }
      // check if switch
      if (this.layout === layout) {
        const component = this.getLayout();
        if (component) component.onResize();
      } else {
        // load module layout
        this.$meta.module.use(this.$meta.config.layout.items[layout].module, module => {
          this.$options.components[layout] = module.options.components[this.$meta.config.layout.items[layout].component];
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
      url = `${url}?returnTo=${encodeURIComponent(this.$meta.util.combineHash(hashInit))}`;
      location.assign(url);
    },
    _authEcho(cb) {
      // get auth first
      this.$api.post('/a/base/auth/echo').then(data => {
        // login
        this.$store.commit('auth/login', {
          loggedIn: data.user.agent.anonymous === 0,
          user: data.user,
        });
        // instance
        this.$store.commit('auth/setInstance', data.instance);
        // title
        window.document.title = this.$store.getters['auth/title'];
        // ok
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
      });
    },
  },
  beforeDestroy() {
    this.$f7.off('resize', this.onResize);
  },
  mounted() {
    this.$f7ready(() => {
      this.ready();
    });
  },
};

</script>
<style scoped>
</style>
