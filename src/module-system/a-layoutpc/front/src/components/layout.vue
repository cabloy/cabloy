<script>
import Vue from 'vue';
import Header from './header.vue';
import Sidebar from './sidebar.vue';
import Groups from './groups.vue';
const appMethods = Vue.prototype.$meta.module.get('a-components').options.utils.appMethods;

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
        key: 'header',
        ref: 'header',
        style: { height: `${this.size.top}px` },
      });
      children.push(header);
      // groups
      const groups = c('eb-groups', {
        key: 'groups',
        ref: 'groups',
        style: {
          height: `${this.size.main}px`,
          top: `${this.size.top + this.sizeSpacing}px`,
        },
      });
      children.push(groups);
      // sidebar
      const sidebarLeft = this._renderSidebar(c, 'left');
      if (sidebarLeft) children.push(sidebarLeft);
      const sidebarRight = this._renderSidebar(c, 'right');
      if (sidebarRight) children.push(sidebarRight);
      const sidebarBottom = this._renderSidebar(c, 'bottom');
      if (sidebarBottom) children.push(sidebarBottom);
    }
    // ok
    return c('div', { staticClass: 'eb-layout-container eb-layout-container-pc' }, children);
  },
  data() {
    return {
      started: false,
      sidebarInited: false,
      size: {
        layoutWidth: 0,
        layoutHeight: 0,
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
        verySmall: false,
      },
      groups: [],
      layoutDefault: null,
      layoutScene: null,
      layoutConfig: null,
      panelsAll: null,
      buttonsAll: null,
      layoutAtomStaticKey: null,
      appMethods: appMethods(this),
    };
  },
  computed: {
    sidebar() {
      return this.layoutConfig.sidebar;
    },
    sizeSpacing() {
      return this.size.verySmall ? 0 : this.size.spacing;
    },
    sidebarCoverLeft() {
      return this.size.verySmall ? true : this.sidebar.left.cover;
    },
    sidebarCoverRight() {
      return this.size.verySmall ? true : this.sidebar.right.cover;
    },
    sidebarCoverBottom() {
      return this.sidebar.bottom.cover;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.__saveLayoutConfig = this.$meta.util.debounce(() => {
      this.__saveLayoutConfigNow();
    }, 1000);
  },
  beforeDestroy() {
    this.$meta.vueApp.setLayoutInstance(null);
    // click
    this.$f7.off('click', this._handleClicks);
  },
  mounted() {
    this.$meta.vueApp.setLayoutInstance(this);
    this.$f7ready(() => {
      this.__init().then(() => {
        // click
        this.$f7.on('click', this._handleClicks);
        this.$nextTick(() => {
          // start
          this.start();
        });
      });
    });
  },
  methods: {
    onResize() {
      if (!this.started) return;
      this.__checkSafeSetSize(() => {
        this.setSize();
        this.$refs.groups.resize();
      });
    },
    setSize() {
      const layoutWidth = this.$$(this.$el).width();
      const layoutHeight = this.$$(this.$el).height();

      this.layoutWidth = layoutWidth;
      this.layoutHeight = layoutHeight;

      // verySmall
      this.size.verySmall = layoutWidth < layoutHeight || layoutWidth <= this.layoutConfig.size.small;

      // spacing
      const spacing = this.sizeSpacing;

      let width = layoutWidth;

      // sidebar
      width -= this._sidebarWidth('left');
      width -= this._sidebarWidth('right');

      this.size.width = width;

      // width
      let enoughLarge = true;
      let enoughMedium = true;
      let small = parseInt((width - spacing * 4) / 3);
      if (small < this.layoutConfig.size.small) {
        enoughLarge = false;
        small = parseInt((width - spacing * 3) / 2);
        if (small < this.layoutConfig.size.small) {
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
      let height = layoutHeight;
      this.size.top = this.layoutConfig.size.top;

      height -= this.size.top;
      height -= this._sidebarHeight('bottom');

      this.size.height = height;
      this.size.main = height - spacing * 2;
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
          if (!this._checkSpecialPath()) {
            this.openHome();
          }
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    _checkSpecialPath() {
      const query = this.$utils.parseUrlQuery();
      const path = query && query.__to;
      if (!path) return false;
      return false;
    },
    openMine() {
      this.$meta.eventHub.$emit('mine:open');
    },
    openHome() {
      // menu
      // home
      // user
    },
    // options:
    //  target: _self/_view/_group
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
        // force new no matter _view/_group
        groupForceNew = window.event && (window.event.metaKey || window.event.ctrlKey || window.event.button === 1);
        if (options.groupId) {
          groupId = options.groupId;
          groupForceNew = false;
        } else if (groupForceNew) {
          groupId = null;
          groupForceNew = true;
        } else if (target === '_group') {
          groupId = null;
          groupForceNew = false;
        } else if (target === '_view' && $viewEl && $viewEl.hasClass('eb-layout-view')) {
          // open at right even in eb-layout-scene
          groupId = $viewEl.parents('.eb-layout-group').data('groupId');
        } else if (
          !$viewEl ||
          $viewEl.parents('.eb-layout-scene').length > 0 ||
          ctx.$view.f7View.router.url.indexOf('/a/dashboard/dashboard?') === 0
        ) {
          groupId = null;
          groupForceNew = false;
        } else {
          // open at right as _view
          groupId = $viewEl.parents('.eb-layout-group').data('groupId');
        }
        // get view
        this.$refs.groups
          .createView({
            ctx,
            groupId,
            groupForceNew,
            url,
            scene: options.scene,
            sceneOptions: options.sceneOptions,
            options,
          })
          .then(res => {
            if (!res) return;
            // navigate
            if (res.options) options = this.$utils.extend({}, options, res.options);
            res.view.f7View.router.navigate(url, options);
            // autohide
            this._autoHideAllSidebars();
          });
      }
    },
    openLogin(routeTo, options) {
      this.$meta.vueApp.openLogin(routeTo, options);
    },
    closeView(view, options) {
      if (view.$el.parents('.eb-layout-sidebar-left').length > 0) {
        return this.$refs.sidebarLeft.closeView(view, options);
      } else if (view.$el.parents('.eb-layout-sidebar-right').length > 0) {
        return this.$refs.sidebarRight.closeView(view, options);
      } else if (view.$el.parents('.eb-layout-sidebar-bottom').length > 0) {
        return this.$refs.sidebarBottom.closeView(view, options);
      }
      this.$refs.groups.closeView(view, options);
    },
    closePanel(side, panel) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      this.$refs[`sidebar${sideUpperCase}`].closePanel(panel);
    },
    backLink(ctx) {
      let backLink = false;
      const routeDiff = this.$meta.util.viewRouterDid(ctx.$view) ? 2 : 1;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - routeDiff])) {
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
        default:
          break;
      }
      return sizeClass;
    },
    _sidebarWidth(side) {
      let width = 0;
      if (this._getSidebarDisplay(side)) {
        width += this.sidebar[side].tabsWidth;
      }
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      if (this.sidebar[side].opened && !this[`sidebarCover${sideUpperCase}`]) {
        width += this.sidebar[side].panelWidth;
      }
      return width;
    },
    _sidebarHeight(side) {
      let height = 0;
      if (this._getSidebarDisplay(side)) {
        height += this.sidebar[side].tabsHeight;
      }
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      if (this.sidebar[side].opened && !this[`sidebarCover${sideUpperCase}`]) {
        height += this.sidebar[side].panelHeight;
      }
      return height;
    },
    _handleClicks(event) {
      const $clickedEl = this.$$(event.target);
      const $clickedSidebarEl = $clickedEl.closest('.eb-layout-sidebar');
      if ($clickedSidebarEl.length === 0) {
        this._hideAllSidebars();
      }
    },
    _hideAllSidebars() {
      if (this.sidebarCoverLeft && this.sidebar.left.opened) {
        this.$refs.sidebarLeft.setOpened(false);
      }
      if (this.sidebarCoverRight && this.sidebar.right.opened) {
        this.$refs.sidebarRight.setOpened(false);
      }
      if (this.sidebarCoverBottom && this.sidebar.bottom.opened) {
        this.$refs.sidebarBottom.setOpened(false);
      }
    },
    _autoHideAllSidebars() {
      if (!this.layoutConfig.autoHideSidebarOnOpenUrl) return;
      this._hideAllSidebars();
    },
    __getResourcesAll() {
      const resourceTypes = [
        { name: 'panel', var: 'panelsAll' },
        { name: 'button', var: 'buttonsAll' },
      ];
      const promises = [];
      for (const resourceType of resourceTypes) {
        promises.push(
          this.$store
            .dispatch('a/base/getResources', { resourceType: `a-layoutpc:${resourceType.name}` })
            .then(data => {
              this[resourceType.var] = data;
            })
        );
      }
      return Promise.all(promises);
    },
    async __initLayoutKey() {
      const appPresetConfig = await this.$store.dispatch('a/app/getPresetConfigCurrent');
      this.layoutAtomStaticKey = appPresetConfig.layout;
      return this.layoutAtomStaticKey;
    },
    async __init() {
      const atomStaticKey = await this.__initLayoutKey();
      // panelsAll & buttonsAll
      await this.__getResourcesAll();
      // layoutDefault
      this.layoutDefault = this.$config.layout.default;
      // layoutScene
      const _layout = await this.$api.post('/a/base/resource/read', {
        atomStaticKey,
        options: { locale: false },
      });
      this.layoutScene = JSON.parse(_layout.content);
      // layoutConfig
      const res = await this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutpc');
      // init layoutConfig
      this.__initLayoutConfig(res[`layout:${atomStaticKey}`]);
      // init sidebar
      this.__initSidebar('top');
      this.__initSidebar('left');
      this.__initSidebar('right');
      this.__initSidebar('bottom');
      // spacing
      this.size.spacing = this.layoutConfig.size.spacing;
      // inited
      this.sidebarInited = true;
    },
    __saveLayoutConfigNow() {
      // override
      const value = this.$meta.util.extend({}, this.layoutConfig);
      // remove dynamic resources
      this.__removeDynamicResources(value.sidebar.top);
      this.__removeDynamicResources(value.sidebar.left);
      this.__removeDynamicResources(value.sidebar.right);
      this.__removeDynamicResources(value.sidebar.bottom);
      // save
      if (this.layoutAtomStaticKey) {
        this.$store.commit('a/base/setLayoutConfigKey', {
          module: 'a-layoutpc',
          key: `layout:${this.layoutAtomStaticKey}`,
          value,
        });
      }
    },
    __initLayoutConfig(layoutConfig) {
      if (layoutConfig) {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene, layoutConfig);
      } else {
        this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene);
      }
    },
    reset() {
      this.layoutConfig = this.$meta.util.extend({}, this.layoutDefault, this.layoutScene);
      this.__saveLayoutConfigNow();
      this.$meta.vueApp.reload();
    },
    __removeDynamicResource(resources) {
      for (let index = resources.length - 1; index >= 0; index--) {
        const resource = resources[index];
        if (!resource.atomStaticKey && !resource.module) {
          resources.splice(index, 1);
        } else {
          resources[index] = resource.atomStaticKey
            ? { atomStaticKey: resource.atomStaticKey }
            : { module: resource.module, name: resource.name };
        }
      }
    },
    __removeDynamicResources(side) {
      const types = ['panels', 'buttons'];
      for (const type of types) {
        const resources = side[type];
        if (resources) {
          this.__removeDynamicResource(resources);
        }
      }
    },
    __initSidebar(side) {
      const panels = this.sidebar[side].panels;
      const buttons = this.sidebar[side].buttons;

      if (panels) {
        this.sidebar[side].panels = [];
        for (const panel of panels) {
          this.sidebar[side].panels.push(this._preparePanel(panel));
        }
      }
      if (buttons) {
        this.sidebar[side].buttons = [];
        for (const button of buttons) {
          this.sidebar[side].buttons.push(this._prepareButton(button));
        }
      }
    },
    _findResourceStock(resourcesAll, resource) {
      if (!resourcesAll) return null;
      const _resource = resourcesAll[this._resourceFullName(resource)];
      if (!_resource) return null;
      return {
        ...resource,
        title: _resource.atomName,
        titleLocale: _resource.atomNameLocale,
        resourceAtomId: _resource.atomId,
        resourceConfig: JSON.parse(_resource.resourceConfig),
      };
    },
    _findPanelStock(panel) {
      return this._findResourceStock(this.panelsAll, panel);
    },
    _findButtonStock(button) {
      return this._findResourceStock(this.buttonsAll, button);
    },
    _preparePanel(panel, url) {
      // extra
      const _panelExtra = { resourceConfig: {} };
      if (url) _panelExtra.resourceConfig.url = url;
      if (panel.title) _panelExtra.titleLocale = this.$text(panel.title);
      // stock
      const panelStock = this._findPanelStock(panel);
      // extend
      return this.$meta.util.extend({}, panelStock, panel, _panelExtra);
    },
    _prepareButton(button) {
      // stock
      const buttonStock = this._findButtonStock(button);
      // extend
      return this.$meta.util.extend({}, buttonStock, button);
    },
    _renderSidebar(c, side) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      let style;
      if (side === 'left' || side === 'right') {
        style = {
          height: `${this.size.height}px`,
          top: `${this.size.top}px`,
        };
      } else {
        style = {
          width: '100%',
          bottom: '0',
        };
      }
      return c('eb-sidebar', {
        key: `sidebar:${side}`,
        ref: `sidebar${sideUpperCase}`,
        staticClass: this._getSidebarDisplay(side) ? '' : 'display-none',
        props: {
          side,
          options: this.sidebar[side],
        },
        style,
      });
    },
    _getSidebarDisplay(side) {
      if (side === 'left' || side === 'right') {
        return this.sidebar[side].panels.length > 0;
      }
      return this.sidebar[side].panels.length > 0 || this.sidebar[side].buttons.length > 0;
    },
    _createPanel({ side, panel, url, options, init }) {
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      // prepare panel
      panel = this._preparePanel(panel, url);
      // check if has exists
      const _panelTabIndex = this.sidebar[side].panels.findIndex(
        item => this._panelFullName(item) === this._panelFullName(panel)
      );
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
    closeButton(side, button) {
      const [, _buttonIndex] = this._findButton(side, button);
      if (_buttonIndex === -1) return;
      this.sidebar[side].buttons.splice(_buttonIndex, 1);
      this.__saveLayoutConfig();
    },
    openButton(side, button) {
      const [, _buttonIndex] = this._findButton(side, button);
      if (_buttonIndex > -1) return;
      // prepare button
      button = this._prepareButton(button);
      this.sidebar[side].buttons.push(button);
      this.__saveLayoutConfig();
    },
    _findButton(side, button) {
      const _buttonIndex = this.sidebar[side].buttons.findIndex(
        item => this._buttonFullName(item) === this._buttonFullName(button)
      );
      if (_buttonIndex === -1) return [null, -1];
      return [this.sidebar[side].buttons[_buttonIndex], _buttonIndex];
    },
    _resourceFullName(resource) {
      if (resource.atomStaticKey) return resource.atomStaticKey;
      return `${resource.module}:${resource.name}`;
    },
    _panelFullName(panel) {
      return this._resourceFullName(panel);
    },
    _buttonFullName(button) {
      return this._resourceFullName(button);
    },
    __checkSafeSetSize(cb) {
      const $view = this.$$('.eb-layout-groups .view.router-transition');
      if ($view.length === 0) return cb();
      window.setTimeout(() => {
        this.__checkSafeSetSize(cb);
      }, 50);
    },
    onbeforeunload() {
      return this.$refs.groups.onbeforeunload();
    },
  },
};
</script>
<style scoped></style>
