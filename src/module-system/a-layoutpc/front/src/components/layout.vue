<script>
import Header from './header.vue';
import Sidebar from './sidebar.vue';
import Groups from './groups.vue';

import Vue from 'vue';
export default {
  meta: {
    global: false,
  },
  components: {
    ebHeader: Header,
    ebSidebar: Sidebar,
    ebGroups: Groups,
  },
  render(c) {
    const children = [];
    if (this.sidebarInited) {
      // header
      const header = c('eb-header', {
        ref: 'header',
        style: { height: `${this.size.top}px` },
      });
      children.push(header);
      // groups
      const groups = c('eb-groups', {
        ref: 'groups',
        style: {
          height: `${this.size.height - this.size.top - this.size.spacing * 2}px`,
          top: `${ this.size.top + this.size.spacing}px`,
        },
      });
      children.push(groups);
      // sidebar
      const sidebarLeft = this._renderSidebar(c, 'left');
      if (sidebarLeft) children.push(sidebarLeft);
      const sidebarRight = this._renderSidebar(c, 'right');
      if (sidebarRight) children.push(sidebarRight);
    }
    // ok
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-pc' }, children);
  },
  data() {
    return {
      started: false,
      sidebarInited: false,
      size: {
        width: 0,
        height: 0,
        small: 0,
        medium: 0,
        large: 0,
        top: 0,
        main: 0,
        spacing: 0,
        enoughMedium: false,
        enoughLarge: false,
      },
      groups: [],
      sidebar: {
        left: {
          opened: false,
          cover: true,
          panels: [],
          views: [],
          panelWidth: 280,
          tabsWidth: 24,
          toolbarHeight: 24,
          panelActive: '',
        },
        right: {
          opened: false,
          cover: true,
          panels: [],
          views: [],
          panelWidth: 280,
          tabsWidth: 24,
          toolbarHeight: 24,
          panelActive: '',
        },
      },
      panelsAll: null,
    };
  },
  beforeDestroy() {
    // click
    this.$f7.off('click', this._handleClicks);
  },
  mounted() {
    this.$f7ready(() => {
      this.__init(() => {
        // click
        this.$f7.on('click', this._handleClicks);
        this.$nextTick(() => {
          // start
          this.start();
        })
      })
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.setSize();
      this.$refs.groups.resize();
    },
    setSize() {
      const layoutWidth = this.$$(this.$el).width();
      const layoutHeight = this.$$(this.$el).height();

      // spacing
      const spacing = this.size.spacing = this.$config.layout.size.spacing;

      let width = layoutWidth;
      let height = layoutHeight;

      // sidebar
      width -= this._sidebarWidth('left');
      width -= this._sidebarWidth('right');

      this.size.width = width;
      this.size.height = height;

      // width
      let enoughLarge = true;
      let enoughMedium = true;
      let small = parseInt((width - spacing * 4) / 3);
      if (small < this.$config.layout.size.small) {
        enoughLarge = false;
        small = parseInt((width - spacing * 3) / 2);
        if (small < this.$config.layout.size.small) {
          enoughMedium = false;
          small = parseInt(width - spacing * 2);
        }
      }
      // size
      this.size.small = small;
      this.size.medium = enoughMedium ? small * 2 + (enoughLarge ? spacing : 0) : small;
      this.size.large = enoughLarge ? small * 3 + spacing * 2 : this.size.medium;

      this.enoughMedium = enoughMedium;
      this.enoughLarge = enoughLarge;

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
      const button = this.$config.layout.header.buttons.find(button => button.sceneOptions && button.sceneOptions.name === 'home');
      if (button) {
        this.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
      }
    },
    navigate(url, options) {
      // options
      options = options || {};
      const ctx = options.ctx;
      const target = options.target;

      // sidebar
      if (options.scene === 'sidebar') {
        const side = options.sceneOptions.side;
        this._createPanel({ side, panel: options.sceneOptions, url, options });
        return;
      }

      // url
      if (!url) return;
      // check if http
      if (url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
        return location.assign(url);
      }

      // view
      if (target === '_self') {
        ctx.$view.f7View.router.navigate(url, options);
      } else {
        // view
        const $viewEl = ctx && ctx.$view && this.$$(ctx.$view.$el);
        // groupId
        let groupId;
        let groupForceNew = false;
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
        this.$refs.groups.createView({ ctx, groupId, groupForceNew, url, scene: options.scene, sceneOptions: options.sceneOptions }).then(res => {
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
      if (view.$el.parents('.eb-layout-sidebar-left').length > 0) {
        return this.$refs.sidebarLeft.closeView(view);
      } else if (view.$el.parents('.eb-layout-sidebar-right').length > 0) {
        return this.$refs.sidebarRight.closeView(view);
      }
      this.$refs.groups.closeView(view);
    },
    closePanel(side, panel) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      this.$refs[`sidebar${sideUpperCase}`].closePanel(panel);
    },
    backLink(ctx) {
      let backLink = false;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - 1])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if ($view.is('.eb-layout-group-view') && parseInt($view.data('index')) > 0) {
          backLink = true;
        }
      }
      return backLink;
    },
    _combineViewSizeClass(size) {
      let sizeClass = '';
      switch (size) {
        case 'small':
          sizeClass = 'eb-view-size-small';
          break;
        case 'medium':
          sizeClass = 'eb-view-size-small eb-view-size-medium';
          break;
        case 'large':
          sizeClass = 'eb-view-size-small eb-view-size-medium eb-view-size-large';
          break;
      };
      return sizeClass;
    },
    _sidebarWidth(side) {
      let width = 0;
      if (this.sidebar[side].panels.length > 0) {
        width += this.sidebar[side].tabsWidth;
      }
      if (this.sidebar[side].opened && !this.sidebar[side].cover) {
        width += this.sidebar[side].panelWidth;
      }
      return width;
    },
    _handleClicks(event) {
      const $clickedEl = this.$$(event.target);
      const $clickedSidebarEl = $clickedEl.closest('.eb-layout-sidebar');
      if ($clickedSidebarEl.length === 0) {
        if (this.sidebar.left.cover && this.sidebar.left.opened) {
          this.$refs.sidebarLeft.setOpened(false);
        }
        if (this.sidebar.right.cover && this.sidebar.right.opened) {
          this.$refs.sidebarRight.setOpened(false);
        }
      }
    },
    __init(cb) {
      // panelsAll
      this.$store.dispatch('a/base/getPanels').then(panels => {
        this.panelsAll = panels;
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutpc').then(layoutConfig => {
          // init layoutConfig
          this.__initLayoutConfig(layoutConfig);
          // init sidebar
          const configFirst = !layoutConfig.sidebar;
          this.__initSidebar('left', configFirst);
          this.__initSidebar('right', configFirst);
          // inited
          this.sidebarInited = true;
          cb();
        });
      });
    },
    __saveLayoutConfig: Vue.prototype.$meta.util.debounce(function() {
      // override
      let value = JSON.parse(JSON.stringify(this.sidebar));
      // remove dynamic panels
      this.__removeDynamicPanels(value.left);
      this.__removeDynamicPanels(value.right);
      // save
      this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-layoutpc', key: 'sidebar', value });
    }, 1000),
    __initLayoutConfig(layoutConfig) {
      if (layoutConfig.sidebar) {
        this.sidebar = this.$utils.extend({}, this.sidebar, JSON.parse(JSON.stringify(layoutConfig.sidebar)));
      }
    },
    __removeDynamicPanels(side) {
      // panels
      const panels = side.panels;
      for (let index = panels.length - 1; index >= 0; index--) {
        const panel = panels[index];
        if (!panel.module) {
          panels.splice(index, 1);
        } else {
          panels[index] = { module: panel.module, name: panel.name };
        }
      }
      // views
      side.views = [];
    },
    __initSidebar(side, configFirst) {
      // panels from layoutConfig or frontConfig
      let panels;
      if (configFirst) {
        const configSidebar = this.$config.layout.sidebar;
        panels = configSidebar[side] && configSidebar[side].panels;
      } else {
        panels = this.sidebar[side].panels;
      }
      if (!panels) return;
      this.sidebar[side].panels = [];
      for (const panel of panels) {
        this.sidebar[side].panels.push(this._preparePanel(panel));
      }
    },
    _findPanelStock(panel) {
      if (!this.panelsAll || !panel.module) return null;
      const panels = this.panelsAll[panel.module];
      return panels[panel.name];
    },
    _preparePanel(panel, url) {
      // extra
      const _panelExtra = {};
      if (url) _panelExtra.url = url;
      if (panel.title) _panelExtra.titleLocale = this.$text(panel.title);
      // stock
      const panelStock = this._findPanelStock(panel);
      // extend
      return this.$utils.extend({}, panelStock, panel, _panelExtra);
    },
    _renderSidebar(c, side) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      return c('eb-sidebar', {
        ref: `sidebar${sideUpperCase}`,
        staticClass: this.sidebar[side].panels.length === 0 ? 'display-none' : '',
        props: {
          side,
          options: this.sidebar[side],
        },
        style: {
          height: `${this.size.height - this.size.top}px`,
          top: `${ this.size.top}px`,
        },
      });
    },
    _createPanel({ side, panel, url, options, init }) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      // prepare panel
      panel = this._preparePanel(panel, url);
      // check if has exists
      const _panelTabIndex = this.sidebar[side].panels.findIndex(item => this._panelFullName(item) === this._panelFullName(panel));
      if (_panelTabIndex === -1) {
        this.sidebar[side].panels.push(panel);
        if (this.sidebar[side].panels.length === 1) {
          this.onResize();
        }
      } else {
        // always update, maybe some properties have changed
        this.sidebar[side].panels.splice(_panelTabIndex, 1, panel);
      }
      // create view
      this.$nextTick(() => {
        this.$refs[`sidebar${sideUpperCase}`].createView({ ctx: null, panel, options, init });
      });
    },
    _panelFullName(panel) {
      if (panel.module) return `${panel.module}:${panel.name}`;
      return panel.name;
    }
  },
};

</script>
<style scoped>
</style>
