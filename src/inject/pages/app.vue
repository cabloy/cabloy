<script>
import Vue from 'vue';
const dialogLocales = [ 'buttonCancel', 'buttonOk', 'passwordPlaceholder', 'preloaderTitle', 'progressTitle', 'usernamePlaceholder' ];
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
    return c('div', [ app ]);
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
        // loginInfo
        this.$store.commit('auth/setLoginInfo', data);
        // title
        window.document.title = this.$store.getters['auth/title'];
        // check if need activation
        this._checkActivation();
        // set locale resource
        this._setLocaleResource();
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
    _setLocaleResource() {
      // dialog
      const dialog = this.$f7.params.dialog;
      for (const key of dialogLocales) {
        dialog[key] = this.$text(dialog[key]);
      }
    },
    _checkActivation() {
      //
      const hashInit = this.$store.state.auth.hashInit;
      if (hashInit) return;
      //
      const userAgent = this.$store.state.auth.user.agent;
      const configBase = this.$meta.config.modules['a-base'];
      const account = configBase.account;
      //
      if (userAgent.anonymous) return;
      if (userAgent.activated || !account.needActivation) return;
      //
      const way = this._chooseActivationWay(account);
      if (!way) return;
      //
      this.$store.commit('auth/setHashInit', way.url);
    },
    _chooseActivationWay(account) {
      const ways = account.activationWays.split(',');
      for (const way of ways) {
        if (way === 'email' && account.url.emailConfirm) return { way, url: account.url.emailConfirm };
        if (way === 'mobile' && account.url.mobileVerify) return { way, url: account.url.mobileVerify };
      }
      return null;
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
