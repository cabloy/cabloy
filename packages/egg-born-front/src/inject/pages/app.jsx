const F7Locales = {
  dialog: ['buttonCancel', 'buttonOk', 'passwordPlaceholder', 'preloaderTitle', 'progressTitle', 'usernamePlaceholder'],
  picker: ['toolbarCloseText'],
  colorPicker: ['navbarTitleText', 'navbarCloseText'],
  calendar: ['timePickerPlaceholder', 'headerPlaceholder', 'toolbarCloseText'],
  smartSelect: [
    'pageBackLinkText',
    'popupCloseLinkText',
    'sheetCloseLinkText',
    'searchbarPlaceholder',
    'searchbarDisableText',
  ],
};
export default {
  render(c) {
    const children = [];
    // layout
    if (this.layout) {
      children.push(
        c(this.layout, {
          ref: 'layout',
        })
      );
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
        },
      });
      const elErrorContainer = c(
        'div',
        {
          staticClass: 'eb-init-error-container',
        },
        [c('div', [elError, elButton])]
      );
      children.push(elErrorContainer);
    }
    // app
    const app = c(
      'f7-app',
      {
        staticClass: '',
        props: { params: this.$root.$options.framework7 },
      },
      children
    );
    return c('div', [app]);
  },
  data() {
    return {
      layout: null,
      sticky: true,
      error: null,
      layoutPrefer: null,
      layoutPreferNotification: null,
      layoutPreferSwitchButton: null,
      layoutInstance: null,
      reloading: false,
    };
  },
  created() {
    this.onResize = this.$meta.util.debounce(() => {
      this.resize();
    }, 300);
  },
  beforeDestroy() {
    this.$f7.off('resize', this.onResize);
    this._clearLayoutPreferNotification();
  },
  mounted() {
    this.$f7ready(() => {
      this.ready();
    });
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
    setLayoutInstance(layoutInstance) {
      this.layoutInstance = layoutInstance;
    },
    clearLayoutInstance(layoutInstance) {
      if (this.layoutInstance === layoutInstance) {
        this.layoutInstance = null;
      }
    },
    getLayoutInstance() {
      return this.layoutInstance;
    },
    _clearLayoutPreferNotification() {
      this.layoutPrefer = null;
      if (this.layoutPreferSwitchButton) {
        this.layoutPreferSwitchButton.off('click');
        this.layoutPreferSwitchButton = null;
      }
      if (this.layoutPreferNotification) {
        if (!this.layoutPreferNotification.destroyed) {
          this.layoutPreferNotification.close();
        }
        this.layoutPreferNotification = null;
      }
    },
    _calcLayout() {
      // layout prefer
      const layoutPrefer = this._calcLayoutPrefer();
      // layout real
      let layoutReal;
      if (this.sticky && this.layout) {
        layoutReal = this.layout;
      } else {
        layoutReal = layoutPrefer;
      }
      // notification
      if (layoutPrefer === layoutReal) {
        // force clear layoutPrefer and notification
        this._clearLayoutPreferNotification();
      } else {
        if (this.layoutPrefer !== layoutPrefer) {
          // force clear layoutPrefer and notification
          this._clearLayoutPreferNotification();
          this.layoutPrefer = layoutPrefer;
          this._showNotificationLayoutPrefer({ layoutPrefer });
        }
      }
      // ok
      return layoutReal;
    },
    async _showNotificationLayoutPrefer({ layoutPrefer }) {
      // options
      const title = this.$text(layoutPrefer === 'pc' ? 'AppLayoutSwitchPromptPC' : 'AppLayoutSwitchPromptMobile');
      const icon = await this.$meta.util.combineIcon({ f7: '::info-circle', size: 16 });
      const options = {
        icon,
        title,
        text: `<div><button class="button AppLayoutSwitchNow">${this.$text('Switch Now')}</button></div>`,
        closeButton: true,
        closeOnClick: false,
        swipeToClose: false,
        on: {
          closed(notification) {
            notification.destroy();
          },
        },
      };
      // closeTimeout
      const closeTimeout = this.$meta.config.layout.notification.closeTimeout;
      if (closeTimeout !== -1) {
        options.closeTimeout = closeTimeout;
      }
      this.layoutPreferNotification = this.$f7.notification.create(options);
      this.layoutPreferNotification.open();
      this.layoutPreferSwitchButton = this.$$('.AppLayoutSwitchNow');
      this.layoutPreferSwitchButton.on('click', () => {
        this._switchPreferLayout();
      });
    },
    async _showNotificationError({ title }) {
      const icon = await this.$meta.util.combineIcon({ f7: '::cross-circle', size: 16 });
      const notification = this.$f7.notification.create({
        icon,
        title,
        closeTimeout: 3000,
      });
      notification.open();
    },
    _switchPreferLayout() {
      if (!this.layoutPrefer) return;
      // set layout
      this.setLayout(this.layoutPrefer);
      // force clear layoutPrefer and notification
      this._clearLayoutPreferNotification();
    },
    _calcLayoutPrefer() {
      const breakpoint = this.$meta.config.layout.breakpoint;
      const windowWidth = window.document.documentElement.clientWidth;
      const windowHeight = window.document.documentElement.clientHeight;
      let layout = windowWidth < windowHeight || windowWidth <= breakpoint ? 'mobile' : 'pc';
      if (!this._getLayoutItem(layout)) {
        layout = layout === 'pc' ? 'mobile' : 'pc';
      }
      return layout;
    },
    resize() {
      // layout
      const layout = this._calcLayout();
      // set
      this.setLayout(layout);
    },
    setLayout(layout) {
      // check if switch
      if (this.layout === layout) {
        const component = this.getLayoutInstance();
        if (component) component.onResize();
      } else {
        // load module layout
        this.$meta.module.use(this._getLayoutItem(layout).module, module => {
          this.$options.components[layout] = module.options.components[this._getLayoutItem(layout).component];
          // clear router history
          this.$meta.util.clearRouterHistory();
          // set html css layout
          this._setHtmlCSSLayout(layout);
          // ready
          this.layout = layout;
        });
      }
    },
    async reload(ops) {
      if (this.reloading) return;
      this.reloading = true;
      try {
        // ops
        ops = ops || { echo: false, hash: null };
        // hash
        if (ops.hash && ops.hash !== '/') this.$store.commit('auth/setHashInit', ops.hash);
        // reload
        this.$store.commit('auth/setReload', true);
        // echo
        if (ops.echo) {
          await this._authEcho();
          this._reloadLayout();
        } else {
          this._reloadLayout();
        }
      } finally {
        this.reloading = false;
      }
    },
    async _authEchoInit() {
      await this._authEcho();
      // resize
      this.resize();
    },
    _setTheme(theme) {
      return this.$meta.theme.set(theme);
    },
    _setHtmlCSSLayout(layout) {
      const $html = this.$$('html');
      $html.removeClass(`eb-layout-${layout === 'pc' ? 'mobile' : 'pc'}`);
      $html.addClass(`eb-layout-${layout}`);
    },
    _setHtmlCSSAuthStatus() {
      const loggedIn = this.$store.state.auth.loggedIn;
      const $html = this.$$('html');
      $html.removeClass(`eb-user-${loggedIn ? 'anonymous' : 'authenticated'}`);
      $html.addClass(`eb-user-${loggedIn ? 'authenticated' : 'anonymous'}`);
    },
    async _setLocaleModules(localeModules) {
      if (!localeModules || localeModules.length === 0) return;
      const promises = [];
      for (const localeModule of localeModules) {
        promises.push(this.$meta.module.use(localeModule));
      }
      return await Promise.all(promises);
    },
    async _authEcho() {
      try {
        // get auth first
        const locale = this.$meta.util.getLocale();
        const data = await this.$api.post(`/a/base/auth/echo?locale=${locale}`);
        // instance
        this.$store.commit('auth/setInstance', data.instance);
        // loginInfo
        this.$store.commit('auth/setLoginInfo', data);
        // clientId
        this.$store.commit('auth/setClientId', data.clientId);
        // login, should after setClientId
        this.$store.commit('auth/login', {
          loggedIn: data.user.agent.anonymous === 0,
          user: data.user,
        });
        // title
        window.document.title = this.$store.getters['auth/title'];
        // check if need activation
        this._checkActivation();
        // set locale resource
        this._setLocaleResource();
        // set auth status
        this._setHtmlCSSAuthStatus();
        // theme
        await this._setTheme(data.config.theme);
        // localeModules
        await this._setLocaleModules(data.config.localeModules);
        // uniform messages
        const useStoreUniform = await this.$store.use('a/message/uniform');
        await useStoreUniform.initialize();
        // error
        this.error = null;
      } catch (err) {
        // err
        this.error = err.message;
        this.layout = null; // force to null
        this._showNotificationError({ title: err.message });
        // should throw error
        throw err;
      }
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
      // should not return, as cause 403 when open hashInit
      // if (hashInit) return;
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
      let url = way.url;
      // need not check hashInit valid
      if (hashInit) {
        url = this.$meta.util.combineQueries(url, {
          returnTo: hashInit,
        });
      }
      this.$store.commit('auth/setHashInit', url);
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
    _getLayoutModuleConfig() {
      return this.getLayoutInstance().layoutConfig;
    },
    _getUrlLogin() {
      const configLayout = this._getLayoutModuleConfig();
      return configLayout.login;
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
      const configLayout = this._getLayoutModuleConfig();
      return configLayout.loginOnStart === true && !this.$store.state.auth.loggedIn && !this._checkIfPasswordReset();
    },
    popupHashInit() {
      //
      const hashInit = this.$store.state.auth.hashInit;
      this.$store.commit('auth/setHashInit', null);
      //
      if (this._hashInitValid(hashInit)) return hashInit;
      return null;
    },
    _hashInitValid(hashInit) {
      const urlLogin = this._getUrlLogin();
      return hashInit && hashInit !== '/' && hashInit !== urlLogin;
    },
    toLogin({ url, module, path, state, hash }) {
      // hash
      hash = hash || this.popupHashInit();
      // url
      let toApiPage = true;
      if (!url) {
        url = this.$meta.util.combineFetchPath(module, path);
      } else {
        if (url.indexOf('/api/') === 0) {
          url = `${this.$meta.config.api.baseURL}${url}`;
        } else {
          toApiPage = false;
        }
      }
      url = this.$meta.util.combineQueries(url, {
        state: state || 'login',
        returnTo: this.$meta.util.combineHash(hash),
        'x-scene': this.$meta.config.scene,
      });
      // go
      if (toApiPage) {
        location.assign(url);
      } else {
        this.getLayoutInstance().navigate(url);
      }
    },
    openLogin(routeTo, options) {
      // hash init
      let hashInit;
      if (!routeTo || typeof routeTo === 'string') {
        hashInit = routeTo;
      } else if (!routeTo.url || typeof routeTo.url === 'string') {
        hashInit = routeTo.url;
      } else {
        hashInit = routeTo.url.url;
      }
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      // query
      const query = routeTo && routeTo.query;
      // url
      let url = this._getUrlLogin();
      url = query ? this.$meta.util.combineQueries(url, query) : url;
      // navigate
      this.getLayoutInstance().navigate(url, options);
    },
    onClickTryAgain() {
      this.error = null;
      this._authEchoInit();
    },
    async logout() {
      await this.$api.post('/a/base/auth/logout');
      await this.reload({ echo: true });
    },
  },
};
