<script>
import TabViews from './tabViews.vue';
import Group from './group.vue';

export default {
  meta: {
    global: false,
  },
  components: {
    ebTabViews: TabViews,
    ebGroup: Group,
  },
  render(c) {
    // children
    const children = [];

    // tab views
    if (this.tabShowed) {
      children.push(c('eb-tab-views', { ref: 'tabViews' }));
    }

    // group
    children.push(c('eb-group', { ref: 'group' }));

    // ready
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-mobile' }, children);
  },
  data() {
    return {
      started: false,
      tabShowed: false,
      sizeExtent: null,
      size: null,
    };
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
      const width = this.$$(window).width();
      const height = this.$$(window).height();

      // sizeExtent
      this.sizeExtent = { width, height };

      // size
      if (width <= this.$config.layout.size.small * 2) {
        this.size = 'small';
      } else if (width > this.$config.layout.size.small * 3) {
        this.size = 'large';
      } else {
        this.size = 'middle';
      }
    },
    start() {
      // loginOnStart
      const vueApp = this.$meta.vueApp;
      if (vueApp.checkIfNeedOpenLogin()) {
        // open view login
        this.openLogin();
      } else {
        const hashInit = vueApp.popupHashInit();
        if (hashInit) {
          this.navigate(hashInit);
        } else {
          this.openHome();
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    openHome() {
      this.tabShowed = true;
    },
    navigate(url, options) {
      if (!url) return;
      // check if http
      if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
        return location.assign(url);
      }
      options = options || {};
      const ctx = options.ctx;
      const target = options.target;
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        // view
        const $viewEl = ctx && ctx.$view && this.$$(ctx.$view.$el);
        // check if target===_view or in views
        if (!$viewEl || target === '_view' || $viewEl.parents('.eb-layout-scene').length > 0) {
          // in new view
          this.$refs.group.createView({ ctx, url }).then(res => {
            if (res) {
              if (res.options) options = this.$utils.extend({}, options, res.options);
              res.view.f7View.router.navigate(url, options);
            }
          });
        } else {
          // in current view
          ctx.$view.f7View.router.navigate(url, options);
        }
      }
    },
    openLogin(routeTo) {
      const hashInit = (!routeTo || typeof routeTo === 'string') ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.navigate(this.$config.layout.login);
    },
    closeView(view) {
      this.$refs.group.closeView(view);
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if ($view.length > 0) backLink = true;
      }
      return backLink;
    },
  },
};

</script>
<style scoped>
</style>
