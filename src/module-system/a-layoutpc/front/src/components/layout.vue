<script>
import patch from '../patch.js';
import LayoutView from './layoutView.vue';
import Header from './header.vue';
import Groups from './groups.vue';

export default {
  meta: {
    global: false,
  },
  components: {
    ebLayoutView: LayoutView,
    ebHeader: Header,
    ebGroups: Groups,
  },
  render(c) {
    const header = c('eb-header', {
      ref: 'header',
      style: { height: `${this.size.top}px` },
    });
    const groups = c('eb-groups', {
      ref: 'groups',
      style: {
        height: `${this.size.height - this.size.top - this.size.spacing * 2}px`,
        top: `${this.size.spacing}px`,
      },
    });
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-pc' }, [ header, groups ]);
  },
  _render(c) {
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
  data() {
    return {
      started: false,
      viewMainVisible: false,
      viewLoginVisible: false,
      tabShowed: false,
      size: {
        width: 0,
        height: 0,
        small: 0,
        middle: 0,
        enough: false,
        top: 0,
        main: 0,
        spacing: 0,
      },
      groups: [],
      router: null,
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
  mounted() {
    this.$f7ready(() => {
      // start
      this.start();
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.setSize();
    },
    patchRouter(router) {
      this.router = patch(this, router);
    },
    setSize() {
      const width = this.size.width = this.$$(this.$el).width();
      const height = this.size.height = this.$$(this.$el).height();

      // spacing
      const spacing = this.size.spacing = this.$config.layout.size.spacing;

      // width
      const small = parseInt((width - spacing * 3) / 3);
      if (small < this.$config.layout.size.small) {
        this.size.small = parseInt((width - spacing * 2) / 2);
        this.size.enough = false;
      } else {
        this.size.small = small;
        this.size.enough = true;
      }
      this.size.middle = this.size.small * 2;

      // height
      this.size.top = this.$config.layout.size.top;
      this.size.main = height - this.size.top - spacing * 2;
    },
    start() {
      // size
      this.setSize();
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
        // groupId
        let groupId;
        if (!ctx.$view || target === '_group' || this.$$(ctx.$view.$el).parents('.eb-layout-group-dashboard').length > 0) {
          groupId = null;
        } else {
          groupId = this.$$(ctx.$view.$el).parents('.eb-layout-group').data('groupId');
        }
        // get view
        this.getView({ ctx, groupId, url, dashboard: target === '_dashboard' }).then(res => {
          if (res) {
            if (res.options) this.$utils.extend(options, res.options);
            res.view.f7View.router.navigate(url, options);
          }
        });
      }
    },
    getView({ ctx, groupId, url, dashboard }) {
      return new Promise(resolve => {
        let group;
        if (groupId) {
          group = this.groups.find(group => group.id === groupId);
        } else {
          group = this.groups.find(group => group.url === url);
        }
        if (!group) {
          groupId = this.$meta.util.nextId('layoutgroup');
          group = {
            id: groupId,
            url,
            title: '',
            dashboard,
            views: [],
          };
          if (dashboard) {
            this.groups.unshift(group);
          } else {
            this.groups.push(group);
          }
        }
        if (group.url === url && group.views.length > 0) {
          this.$f7.tab.show(`#${group.id}`);
          resolve(null);
        } else {
          let viewIndex = -1;
          if (ctx.$view) {
            viewIndex = parseInt(this.$$(ctx.$view.$el).data('index'));
            if (viewIndex >= group.views.length - 1) {
              viewIndex = -1;
            }
          }
          if (viewIndex === -1) {
            group.views.push({
              id: this.$meta.util.nextId('layoutgroupview'),
              url,
              callback: view => {
                this.$f7.tab.show(`#${group.id}`);
                resolve({ view, options: null });
              },
            });
          } else {
            // remove last views
            for (let i = group.views.length - 1; i >= 0; i--) {
              if (i > viewIndex + 1) {
                group.views.splice(i, 1);
              }
            }
            this.$refs.groups.reLayout(groupId);
            // return next view
            const view = this.$refs.groups.getView(group.id, group.views[viewIndex + 1].id);
            resolve({ view, options: { reloadAll: true } });
          }
        }
      });
    },
    removeGroup(groupId) {
      let groupIdNext;
      const index = this.groups.findIndex(group => group.id === groupId);
      if (this.$refs.header.isTabActive(groupId)) {
        if (index > 0) {
          groupIdNext = this.groups[index - 1].id;
        } else if (this.groups.length > 1) {
          groupIdNext = this.groups[index + 1].id;
        }
      }
      this.groups.splice(index, 1);
      this.$nextTick(() => {
        if (groupIdNext) {
          this.$f7.tab.show(`#${groupIdNext}`);
        } else if (this.groups.length === 0) {
          this.$refs.header.clearHighLight();
        }
      });
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
      const viewIndex = parseInt(this.$$(view.$el).data('index'));
      const groupId = this.$$(view.$el).parents('.eb-layout-group').data('groupId');
      const group = this.groups.find(group => group.id === groupId);
      for (let i = group.views.length - 1; i >= 0; i--) {
        if (i >= viewIndex) {
          group.views.splice(i, 1);
        }
      }
      this.$refs.groups.reLayout(groupId);
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
        if (parseInt($view.data('index')) > 0) backLink = true;
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
