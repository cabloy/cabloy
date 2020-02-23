<script>
import Header from './header.vue';
import Groups from './groups.vue';

export default {
  meta: {
    global: false,
  },
  components: {
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
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-pc' }, [header, groups]);
  },
  data() {
    return {
      started: false,
      size: {
        width: 0,
        height: 0,
        small: 0,
        middle: 0,
        large: 0,
        top: 0,
        main: 0,
        spacing: 0,
      },
      groups: [],
    };
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
      this.$refs.groups.resize();
    },
    setSize() {
      const width = this.size.width = this.$$(this.$el).width();
      const height = this.size.height = this.$$(this.$el).height();

      // spacing
      const spacing = this.size.spacing = this.$config.layout.size.spacing;

      // width
      let enoughLarge = true;
      let enoughMiddle = true;
      let small = parseInt((width - spacing * 4) / 3);
      if (small < this.$config.layout.size.small) {
        enoughLarge = false;
        small = parseInt((width - spacing * 3) / 2);
        if (small < this.$config.layout.size.small) {
          enoughMiddle = false;
          small = parseInt(width - spacing * 2);
        }
      }
      // size
      this.size.small = small;
      this.size.middle = enoughMiddle ? small * 2 + (enoughLarge ? spacing : 0) : small;
      this.size.large = enoughLarge ? small * 3 + spacing * 2 : this.size.middle;

      // height
      this.size.top = this.$config.layout.size.top;
      this.size.main = height - this.size.top - spacing * 2;
    },
    start() {
      // size
      this.setSize();
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
      const button = this.$config.layout.header.buttons.find(button => button.sceneName === 'home');
      if (button) {
        this.navigate(button.url, { _scene: button.scene, _sceneName: button.sceneName });
      }
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
        // groupId
        let groupId;
        let groupForceNew;
        if (target === '_view' && $viewEl && $viewEl.hasClass('eb-layout-view')) {
          // open at right even in eb-layout-scene
          groupId = $viewEl.parents('.eb-layout-group').data('groupId');
        } else if (window.event && (window.event.metaKey || window.event.ctrlKey || window.event.button === 1)) {
          groupId = null;
          groupForceNew = true;
        } else if (!$viewEl || $viewEl.parents('.eb-layout-scene').length > 0) {
          groupId = null;
          groupForceNew = false;
        } else {
          // open at right
          groupId = $viewEl.parents('.eb-layout-group').data('groupId');
        }
        // get view
        this.$refs.groups.createView({ ctx, groupId, groupForceNew, url, scene: options._scene, sceneName: options._sceneName }).then(res => {
          if (res) {
            if (res.options) options = this.$utils.extend({}, options, res.options);
            res.view.f7View.router.navigate(url, options);
          }
        });
      }
    },
    openLogin(routeTo) {
      const hashInit = (!routeTo || typeof routeTo === 'string') ? routeTo : routeTo.url.url;
      if (hashInit && hashInit !== '/') this.$store.commit('auth/setHashInit', hashInit);
      this.navigate(this.$config.layout.login);
    },
    closeView(view) {
      this.$refs.groups.closeView(view);
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if (parseInt($view.data('index')) > 0) backLink = true;
      }
      return backLink;
    },
  },
};

</script>
<style scoped>
</style>
