<script>
import Vue from 'vue';
const F7Locales = {
  dialog: ['buttonCancel', 'buttonOk', 'passwordPlaceholder', 'preloaderTitle', 'progressTitle', 'usernamePlaceholder'],
  picker: ['toolbarCloseText'],
  colorPicker: ['navbarTitleText', 'navbarCloseText'],
  calendar: ['timePickerPlaceholder', 'headerPlaceholder', 'toolbarCloseText'],
};
export default {
  render(c) {
    const children = [];
    // layout
    if (this.layout) {
      children.push(c(this.layout, {
        ref: 'layout',
      }));
    }
    // error
    if (this.error) {
      const elError = c('div', { staticClass: 'eb-breathe' });
      const elButton = c('f7-button', {
        attrs: {
          text: this.$text('Try Again'),
        },
        on: {
          click: this.onClickTryAgain,
        }
      })
      const elErrorContainer = c('div', {
        staticClass: 'eb-init-error-container',
      }, [c('div', [elError, elButton])]);
      children.push(elErrorContainer);
    }
    // app
    const app = c('f7-app', {
      staticClass: '',
      props: { params: this.$root.$options.framework7 },
    }, children);
    return c('div', [app]);
  },
  data() {
    return {
      layout: null,
      sticky: false,
      error: null,
    };
  },
  methods: {
    ready() {
      if (this.$f7.device.ie) {
        this.$f7.dialog.alert('Supports All Modern Browsers Except IE');
        return;
      }
      // hash init
      const hashInit = this.$meta.util.parseHash(location.hash);
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      // on resize
      this.$f7.on('resize', this.onResize);
      // auth echo init
      this._authEchoInit();
    },
    getLayout() {
      return this.$refs.layout;
    },
    _calcLayout() {
      if (this.sticky && this.layout) return this.layout;
      const breakpoint = this.$meta.config.layout.breakpoint;
      const windowWidth = window.document.documentElement.clientWidth;
      const windowHeight = window.document.documentElement.clientHeight;
      let layout = ((windowWidth < windowHeight) || (windowWidth <= breakpoint)) ? 'mobile' : 'pc';
      if (!this._getLayoutItem(layout)) {
        layout = layout === 'pc' ? 'mobile' : 'pc';
      }
      this.sticky = true;
      return layout;
    },
    resize() {
      // layout
      const layout = this._calcLayout();
      // check if switch
      if (this.layout === layout) {
        const component = this.getLayout();
        if (component) component.onResize();
      } else {
        // load module layout
        this.$meta.module.use(this._getLayoutItem(layout).module, module => {
          this.$options.components[layout] = module.options.components[this._getLayoutItem(layout).component];
          // clear router history
          this.$meta.util.clearRouterHistory();
          // ready
          this.layout = layout;
        });
      }
    },
    reload(ops) {
      // ops
      ops = ops || { echo: false, hash: null };
      // hash
      if (ops.hash && ops.hash !== '/') this.$store.commit('auth/setHashInit', ops.hash);
      // reload
      this.$store.commit('auth/setReload', true);
      // echo
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
    _authEchoInit() {
      this._authEcho(() => {
        // resize
        this.resize();
      });
    },
    _setTheme(theme, cb) {
      this.$meta.theme.set(theme).then(cb);
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
        // theme
        this._setTheme(data.config.theme, () => {
          // error
          this.error = null;
          // ok
          return cb && cb();
        });
      }).catch(err => {
        // err
        this.error = err.message;
        this.layout = null; // force to null
        const notification = this.$f7.notification.create({
          icon: '<i class="material-icons">error</i>',
          title: err.message,
          closeTimeout: 3000,
        });
        notification.open();
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
      for (const f7Component in F7Locales) {
        const component = this.$f7.params[f7Component];
        const locales = F7Locales[f7Component];
        for (const key of locales) {
          component[key] = this.$text(component[key]);
        }
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
    _getLayoutItem(layout) {
      return this.$meta.config.layout.items[layout];
    },
    _getLayoutModuleConfig(layout) {
      const moduleName = this._getLayoutItem(layout).module;
      return this.$meta.config.modules[moduleName];
    },
    _checkIfPasswordReset() {
      const hashInit = this.$store.state.auth.hashInit;
      if (!hashInit) return false;
      const configBase = this.$meta.config.modules['a-base'];
      const account = configBase.account;
      const url = account && account.url.passwordReset;
      if (!url) return false;
      return hashInit.indexOf(url) > -1;
    },
    checkIfNeedOpenLogin() {
      const configLayout = this._getLayoutModuleConfig(this.layout);
      return (configLayout.layout.loginOnStart === true &&
        !this.$store.state.auth.loggedIn &&
        !this._checkIfPasswordReset()
      );
    },
    popupHashInit() {
      //
      const hashInit = this.$store.state.auth.hashInit;
      this.$store.commit('auth/setHashInit', null);
      //
      const configLayout = this._getLayoutModuleConfig(this.layout);
      if (hashInit && hashInit !== '/' && hashInit !== configLayout.layout.login) {
        return hashInit;
      }
      return null;
    },
    toLogin({ url, hash }) {
      hash = hash || this.popupHashInit();
      url = this.$meta.util.combineQueries(url, {
        returnTo: this.$meta.util.combineHash(hash),
      });
      location.assign(url);
    },
    onClickTryAgain() {
      this.error = null;
      this._authEchoInit();
    }
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
