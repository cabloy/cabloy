<script>
import patch from '../patch.js';
import LayoutView from './layoutView.vue';

export default {
  meta: {
    global: false,
  },
  render(c) {
    // view main id
    const viewMainId = 'eb-layout-view-main';
    // links and tabs
    const toolbarLinks = [];
    const tabs = [];
    this.$config.layout.tabs.forEach(tab => {
      // tab id
      const id = `eb-layout-tab-${tab.name}`;
      // link
      const _linkAttrs = this.$utils.extend({}, tab);
      _linkAttrs.text = this.$text(_linkAttrs.text || _linkAttrs.name);
      _linkAttrs.tabLink = `#${id}`;
      toolbarLinks.push(c('f7-link', { attrs: _linkAttrs }));
      // view
      const _viewAttrs = {
        id,
        tab: true,
        linksView: `.${viewMainId}`,
        'data-url': tab.url,
        init: true,
        tabActive: tab.tabLinkActive,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
      };
      tabs.push(c('eb-view', { key: id, staticClass: 'eb-layout-tab', attrs: _viewAttrs, on: { 'tab:show': this.onTabShow } }));
    });
    // toolbar
    const _toolbarAttrs = this.$utils.extend({}, this.$config.layout.toolbar);
    const toolbar = c('f7-toolbar', { attrs: _toolbarAttrs }, toolbarLinks);
    // views
    const views = c('f7-views', { attrs: { tabs: true } }, [ toolbar, ...tabs ]);
    // view main
    const viewMain = c('eb-layout-view', {
      ref: 'main',
      attrs: {
        main: true,
        name: 'main',
        pushState: true,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
      },
    });
    // view login
    const viewLogin = c('eb-layout-view', {
      ref: 'login',
      attrs: {
        name: 'login',
        pushState: true,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
      },
    });
    // ready
    return c('div', { staticClass: 'eb-layout-container' }, [ views, viewMain, viewLogin ]);
  },
  components: {
    ebLayoutView: LayoutView,
  },
  data() {
    return {
      started: false,
      viewMainVisible: false,
      viewLoginVisible: false,
      tabShowed: false,
    };
  },
  computed: {
    viewTabsVisible() {
      return this.started && !this.viewMainVisible && !this.viewLoginVisible;
    },
  },
  watch: {
    viewTabsVisible(value) {
      // avoid warn: Duplicate keys detected
      this.$nextTick(() => {
        if (value) {
          this.onTabShow();
        }
      });
    },
    viewMainVisible(value) {
      this.$nextTick(() => {
        if (value) {
          this.$f7.loginScreen.open(this.$refs.main.$el);
        } else {
          this.$f7.loginScreen.close(this.$refs.main.$el);
        }
      });
    },
    viewLoginVisible(value) {
      this.$nextTick(() => {
        if (value) {
          // open
          this.$f7.loginScreen.open(this.$refs.login.$el);
        } else {
          // close
          this.$f7.loginScreen.close(this.$refs.login.$el);
          // clear hashInit
          this.$store.commit('auth/setHashInit', null);
        }
      });
    },
  },
  methods: {
    onF7Ready() {
      // start
      this.start();
    },
    onResize() {
      if (!this.started) return;
    },
    patchRouter(router) {
      patch(this, router);
    },
    start() {
      // loginOnStart
      if (this.$config.layout.loginOnStart === true && !this.$store.state.auth.loggedIn) {
        // open view login
        this.openLogin();
      } else {
        // hash init
        const hashInit = this.$store.state.auth.hashInit;
        this.$store.commit('auth/setHashInit', null);
        // open view main
        if (hashInit && hashInit !== '/' && hashInit !== this.$config.layout.login) this.navigate(hashInit);
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    navigate(url, options) {
      options = options || {};
      let view = options.view || 'main';
      view = typeof view === 'string' ? this.$f7.views[view] : view;
      view.router.navigate(url, options);
      if (view.name === 'main') this.viewMainVisible = true;
    },
    openLogin(routeTo) {
      const hashInit = (!routeTo || typeof routeTo === 'string') ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.$f7.views.login.router.navigate(this.$config.layout.login);
      this.viewLoginVisible = true;
    },
    closeLogin(cancel) {
      this.hideView('login', cancel);
    },
    showView(view) {
      view = typeof view === 'string' ? this.$f7.views[view] : view;
      if (view.name === 'main') this.viewMainVisible = true;
      if (view.name === 'login') this.viewLoginVisible = true;
    },
    hideView(view, cancel = false) {
      view = typeof view === 'string' ? this.$f7.views[view] : view;
      // close
      if (view.name === 'main') this.viewMainVisible = false;
      if (view.name === 'login') this.viewLoginVisible = false;
      // close directly
      if (!cancel) {
        // adjust history
        view.router.navigate('/', { reloadAll: true });
      }
    },
    onTabShow(e) {
      const target = e ? this.$$(e.target) : this.$$('.view.eb-layout-tab.tab-active');
      if (target.hasClass('eb-layout-tab') && target[0].f7View.router.currentRoute.path === '/') {
        target[0].f7View.router.navigate(target.data('url'));
        this.tabShowed = true;
      }
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7Router.history[ctx.$f7Router.history.length - 1])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.view');
        if ($view.hasClass('eb-layout-view-main')) backLink = true;
        else if ($view.hasClass('eb-layout-view-login') && this.tabShowed) backLink = true;
      }
      return backLink;
    },
  },
};

</script>
<style scoped>
.eb-layout-container {
  position: relative;
  width: 100%;
  height: 100%;
}

</style>
