<script>
import LayoutView from './layoutView.vue';

export default {
  meta: {
    global: false,
  },
  render(c) {
    // pushStateMain: disabled for ios
    const pushStateMain = !this.$device.ios;

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
        'data-url': tab.url,
        init: true,
        tabActive: tab.tabLinkActive,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
      };
      tabs.push(c('eb-view', {
        key: id,
        staticClass: 'eb-layout-tab eb-layout-view-size-small',
        attrs: _viewAttrs,
        props: {
          size: 'small',
          sizeExtent: this.sizeExtent,
        },
        on: { 'tab:show': this.onTabShow },
      }));
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
        name: 'main',
        pushState: pushStateMain,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        size: 'small',
        sizeExtent: this.sizeExtent,
      },
    });
    // view login
    const viewLogin = c('eb-layout-view', {
      ref: 'login',
      attrs: {
        name: 'login',
        pushState: pushStateMain,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        size: 'small',
        sizeExtent: this.sizeExtent,
      },
    });
    // ready
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-mobile' }, [ views, viewMain, viewLogin ]);
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
      sizeExtent: null,
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
  created() {
    this._onSize();
  },
  mounted() {
    this.$f7ready(() => {
      // start
      this.start();
    });
  },
  methods: {
    onResize() {
      this._onSize();
    },
    _onSize() {
      // sizeExtent
      this.sizeExtent = {
        width: this.$$(window).width(),
        height: this.$$(window).height(),
      };
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
      const ctx = options.ctx;
      const target = options.target;
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        const viewName = (ctx && ctx.$view.$el.f7View.name) || 'main';
        this.$f7.views[viewName].router.navigate(url, options);
        if (viewName === 'main') {
          this.viewMainVisible = true;
          this.viewLoginVisible = false;
        } else if (viewName === 'login') {
          this.viewMainVisible = false;
          this.viewLoginVisible = true;
        }
      }
    },
    openLogin(routeTo) {
      const hashInit = (!routeTo || typeof routeTo === 'string') ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.$f7.views.login.router.navigate(this.$config.layout.login);
      this.viewLoginVisible = true;
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
      if (target.hasClass('eb-layout-tab')) {
        const path = target[0].f7View.router.currentRoute.path;
        if (!path || path === '/') {
          target[0].f7View.router.navigate(target.data('url'));
          this.tabShowed = true;
        }
      }
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
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
</style>
