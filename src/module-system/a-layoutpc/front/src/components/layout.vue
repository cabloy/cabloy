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
          height: `${this.size.main}px`,
          top: `${ this.size.top + this.sizeSpacing}px`,
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
      sidebar: null,
      panelsAll: null,
      sectionsAll: null,
      buttonsAll: null,
    };
  },
  computed: {
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
  },
  beforeDestroy() {
    // click
    this.$f7.off('click', this._handleClicks);
  },
  created() {
    this.size.spacing = this.$config.layout.size.spacing;
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

      this.layoutWidth = layoutWidth;
      this.layoutHeight = layoutHeight;

      // verySmall
      this.size.verySmall = (layoutWidth < layoutHeight) || (layoutWidth <= this.$config.layout.size.small);

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
      let height = layoutHeight;
      this.size.top = this.$config.layout.size.top;

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
          this.openHome();
        }
      }
      // started
      this.$nextTick(() => {
        this.started = true;
      });
    },
    openHome() {
      const button = this.$config.layout.header.button.home;
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
        if (this.sidebarCoverLeft && this.sidebar.left.opened) {
          this.$refs.sidebarLeft.setOpened(false);
        }
        if (this.sidebarCoverRight && this.sidebar.right.opened) {
          this.$refs.sidebarRight.setOpened(false);
        }
        if (this.sidebarCoverBottom && this.sidebar.bottom.opened) {
          this.$refs.sidebarBottom.setOpened(false);
        }
      }
    },
    __getResourcesAll() {
      const promises = [];
      promises.push(
        this.$store.dispatch('a/base/getPanels').then(panels => {
          this.panelsAll = panels;
        })
      );
      promises.push(
        this.$store.dispatch('a/base/getSections').then(sections => {
          this.sectionsAll = sections;
        })
      );
      promises.push(
        this.$store.dispatch('a/base/getButtons').then(buttons => {
          this.buttonsAll = buttons;
        })
      );
      return Promise.all(promises);
    },
    __init(cb) {
      // panelsAll & sectionsAll & buttonsAll
      this.__getResourcesAll().then(() => {
        // layoutConfig
        this.$store.dispatch('a/base/getLayoutConfig', 'a-layoutpc').then(layoutConfig => {
          // init layoutConfig
          this.__initLayoutConfig(layoutConfig);
          // init sidebar
          this.__initSidebar('top');
          this.__initSidebar('left');
          this.__initSidebar('right');
          this.__initSidebar('bottom');
          // inited
          this.sidebarInited = true;
          cb();
        });
      });
    },
    __saveLayoutConfig: Vue.prototype.$meta.util.debounce(function() {
      // override
      let value = this.$meta.util.extend({}, this.sidebar);
      // remove dynamic panels
      this.__removeDynamicPanels(value.top);
      this.__removeDynamicPanels(value.left);
      this.__removeDynamicPanels(value.right);
      this.__removeDynamicPanels(value.bottom);
      // save
      this.$store.commit('a/base/setLayoutConfigKey', { module: 'a-layoutpc', key: 'sidebar', value });
    }, 1000),
    __initLayoutConfig(layoutConfig) {
      const sidebarDefault = this.$config.layout.sidebar;
      if (layoutConfig.sidebar) {
        this.sidebar = this.$meta.util.extend({}, sidebarDefault, layoutConfig.sidebar);
      } else {
        this.sidebar = this.$meta.util.extend({}, sidebarDefault);
      }
    },
    __removeDynamicPanels(side) {
      // panels
      if (side.panels) {
        const panels = side.panels;
        for (let index = panels.length - 1; index >= 0; index--) {
          const panel = panels[index];
          if (!panel.module) {
            panels.splice(index, 1);
          } else {
            panels[index] = { module: panel.module, name: panel.name };
          }
        }
      }
      // sections
      if (side.sections) {
        const sections = side.sections;
        for (let index = sections.length - 1; index >= 0; index--) {
          const section = sections[index];
          if (!section.module) {
            sections.splice(index, 1);
          } else {
            sections[index] = { module: section.module, name: section.name };
          }
        }
      }
      // buttons
      if (side.buttons) {
        const buttons = side.buttons;
        for (let index = buttons.length - 1; index >= 0; index--) {
          const button = buttons[index];
          if (!button.module) {
            buttons.splice(index, 1);
          } else {
            buttons[index] = { module: button.module, name: button.name };
          }
        }
      }
    },
    __initSidebar(side) {
      let panels = this.sidebar[side].panels;
      let sections = this.sidebar[side].sections;
      let buttons = this.sidebar[side].buttons;

      if (panels) {
        this.sidebar[side].panels = [];
        for (const panel of panels) {
          this.sidebar[side].panels.push(this._preparePanel(panel));
        }
      }
      if (sections) {
        this.sidebar[side].sections = [];
        for (const section of sections) {
          this.sidebar[side].sections.push(this._prepareSection(section));
        }
      }
      if (buttons) {
        this.sidebar[side].buttons = [];
        for (const button of buttons) {
          this.sidebar[side].buttons.push(this._prepareButton(button));
        }
      }
    },
    _findPanelStock(panel) {
      if (!this.panelsAll || !panel.module) return null;
      const panels = this.panelsAll[panel.module];
      return panels[panel.name];
    },
    _findSectionStock(section) {
      if (!this.sectionsAll || !section.module) return null;
      const sections = this.sectionsAll[section.module];
      return sections[section.name];
    },
    _findButtonStock(button) {
      if (!this.buttonsAll || !button.module) return null;
      const buttons = this.buttonsAll[button.module];
      return buttons[button.name];
    },
    _preparePanel(panel, url) {
      // extra
      const _panelExtra = {};
      if (url) _panelExtra.url = url;
      if (panel.title) _panelExtra.titleLocale = this.$text(panel.title);
      // stock
      const panelStock = this._findPanelStock(panel);
      // extend
      return this.$meta.util.extend({}, panelStock, panel, _panelExtra);
    },
    _prepareSection(section) {
      // stock
      const sectionStock = this._findSectionStock(section);
      // extend
      return this.$meta.util.extend({}, sectionStock, section);
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
          top: `${ this.size.top}px`,
        };
      } else {
        style = {
          width: `100%`,
          bottom: '0',
        };
      }
      return c('eb-sidebar', {
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
      return this.sidebar[side].panels.length > 0 || this.sidebar[side].sections.length > 0;
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
    closeSection(side, section) {
      const _sectionIndex = this.sidebar[side].sections.findIndex(item => this._sectionFullName(item) === this._sectionFullName(section));
      if (_sectionIndex === -1) return;
      this.sidebar[side].sections.splice(_sectionIndex, 1);
      if (this.sidebar[side].sections.length === 0) {
        this.onResize();
      }
      this.__saveLayoutConfig();
    },
    openSection(side, section) {
      const _sectionIndex = this.sidebar[side].sections.findIndex(item => this._sectionFullName(item) === this._sectionFullName(section));
      if (_sectionIndex > -1) return;
      // prepare section
      section = this._prepareSection(section);
      this.sidebar[side].sections.push(section);
      if (this.sidebar[side].sections.length === 1) {
        this.onResize();
      }
      this.__saveLayoutConfig();
    },
    closeButton(side, button) {
      const _buttonIndex = this.sidebar[side].buttons.findIndex(item => this._buttonFullName(item) === this._buttonFullName(button));
      if (_buttonIndex === -1) return;
      this.sidebar[side].buttons.splice(_buttonIndex, 1);
      this.__saveLayoutConfig();
    },
    openButton(side, button) {
      const _buttonIndex = this.sidebar[side].buttons.findIndex(item => this._buttonFullName(item) === this._buttonFullName(button));
      if (_buttonIndex > -1) return;
      // prepare button
      button = this._prepareButton(button);
      this.sidebar[side].buttons.push(button);
      this.__saveLayoutConfig();
    },
    _panelFullName(panel) {
      if (panel.module) return `${panel.module}:${panel.name}`;
      return panel.name;
    },
    _sectionFullName(section) {
      if (section.module) return `${section.module}:${section.name}`;
      return section.name;
    },
    _buttonFullName(button) {
      if (button.module) return `${button.module}:${button.name}`;
      return button.name;
    }
  },
};

</script>
<style scoped>
</style>
