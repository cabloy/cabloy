<script>
import SidebarTabs from './sidebarTabs.vue';
import SidebarGroup from './SidebarGroup.vue';
import SidebarToolbar from './SidebarToolbar.vue';

export default {
  components: {
    ebSidebarTabs: SidebarTabs,
    ebSidebarGroup: SidebarGroup,
    ebSidebarToolbar: SidebarToolbar,
  },
  render(c) {
    const children = [];
    // tabs
    const tabs = c('eb-sidebar-tabs', {
      props: {
        side: this.side,
      },
    });
    children.push(tabs);
    // toolbar
    const toolbar = c('eb-sidebar-toolbar', {
      props: {
        side: this.side,
      },
    });
    // panel
    const group = c('eb-sidebar-group', {
      ref: 'sidebarGroup',
      props: {
        side: this.side,
      },
      style: {
        height: `${this.layout.size.height - this.layout.size.top - this.options.toolbarHeight}px`,
        top: `${this.options.toolbarHeight}px`,
      },
    });
    const viewSizeExtent = this.viewSizeExtent;
    const panel = c('f7-panel', {
      staticClass: this.options.opened ? 'panel-show' : 'panel-hide',
      style: {
        width: `${viewSizeExtent.width}px`,
      },
      props: {
        side: this.side,
        visibleBreakpoint: 0,
        effect: 'cover',
        resizable: true,
      },
      on: {
        'panel:resize': this.onPanelResize,
      },
    }, [toolbar, group]);
    children.push(panel);
    // ok
    return c('div', { staticClass: `eb-layout-sidebar eb-layout-sidebar-${this.side}` }, children);
  },
  props: {
    side: {
      type: String,
    },
    options: {
      type: Object,
    }
  },
  data() {
    return {
      initOpened: false,
    }
  },
  computed: {
    layout() {
      return this.$parent;
    },
    viewSize() {
      let size;
      const width = this.options.panelWidth;
      if (width <= this.$config.layout.size.small * 2) {
        size = 'small';
      } else if (width > this.$config.layout.size.small * 3) {
        size = 'large';
      } else {
        size = 'medium';
      }
      return size;
    },
    viewSizeExtent() {
      const layout = this.layout;
      return {
        width: this.options.panelWidth,
        height: layout.size.height - layout.size.top - this.options.toolbarHeight,
      };
    }
  },
  created() {
    const side = this.side;
    const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
    // opened=false if cover
    if (this.layout[`sidebarCover${sideUpperCase}`]) {
      this.options.opened = false;
      this.options.panelActive = '';
    }
    if (!this.options.opened) {
      this.options.panelActive = '';
    }
    this.initOpened = this.options.opened;
    this.options.opened = false;
  },
  mounted() {
    if (this.initOpened && this.options.panelActive && this.options.panelActive.indexOf(':') > -1) {
      const [module, name] = this.options.panelActive.split(':');
      this.layout._createPanel({ side: this.side, panel: { module, name }, init: true });
    }
  },
  methods: {
    createView({ ctx, panel, options, init }) {
      options = options || {};
      // panelName
      const panelName = this.layout._panelFullName(panel);
      // find by name
      const view = this.options.views.find(item => this.layout._panelFullName(item.panel) === panelName);
      if (view) {
        const $view = this.$$(`#${view.id}`);
        // navigate
        if (panel.url && panel.url !== view.panel.url) {
          options = this.$utils.extend({}, options, { reloadAll: true });
          $view[0].f7View.router.navigate(panel.url, options);
        }
        // always update, maybe some properties have changed
        view.panel = panel;
        // change zIndex
        view.zIndex = ++this.$refs.sidebarGroup.viewIndex;
        // active
        this._activeView(panel, init);
        // opened
        this.setOpened(true, init);
        return;
      }
      // new view
      return this.$refs.sidebarGroup.createView({ ctx, panel }).then(res => {
        if (res) {
          if (res.options) options = this.$utils.extend({}, options, res.options);
          res.view.f7View.router.navigate(panel.url, options);
          // active
          this._activeView(panel, init);
          // opened
          this.setOpened(true, init);
        }
      });
    },
    closePanel(panel) {
      const view = this.options.views.find(item => this.layout._panelFullName(item.panel) === this.layout._panelFullName(panel));
      if (view) {
        this._closeView(view.id);
      } else {
        this._removePanel(panel);
      }
    },
    closeView(view) {
      this._closeView(view.$el[0].id);
    },
    _closeView(viewId) {
      // view
      const _view = this._getViewById(viewId);
      const $view = this.$$('#' + _view.id);
      // top view
      const _viewTop = this._getTopView(_view);
      if (_viewTop) {
        this._activeView(_viewTop.panel);
      }
      // close
      $view.addClass('eb-transition-close').animationEnd(() => {
        // remove
        this._removeView(viewId);
        // remove panel
        this._removePanel(_view.panel);
      });
    },
    _getViewById(viewId) {
      return this.options.views.find(item => item.id === viewId);
    },
    _getViewIndexById(viewId) {
      return this.options.views.findIndex(item => item.id === viewId);
    },
    _removeView(viewId) {
      const viewIndex = this._getViewIndexById(viewId);
      if (viewIndex === -1) return;
      this.options.views.splice(viewIndex, 1);
      if (this.options.views.length === 0) {
        this.setOpened(false);
      }
    },
    _getPanelIndex(panel) {
      return this.options.panels.findIndex(item => this.layout._panelFullName(item) === this.layout._panelFullName(panel));
    },
    _getPanelAndIndex(panel) {
      const panelIndex = this._getPanelIndex(panel);
      if (panelIndex === -1) return [null, -1];
      return [this.options.panels[panelIndex], panelIndex];
    },
    _removePanel(panel) {
      const panelIndex = this._getPanelIndex(panel);
      if (panelIndex === -1) return;
      this.options.panels.splice(panelIndex, 1);
      if (this.options.panels.length === 0) {
        this.layout.onResize();
      }
    },
    setOpened(opened, init) {
      if (this.options.opened === opened) return;
      this.options.opened = opened;

      const side = this.side;
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      if (!this.layout[`sidebarCover${sideUpperCase}`]) {
        this.layout.onResize();
      }

      if (!init) {
        this.layout.__saveLayoutConfig();
      }
    },
    setPanelWidth(newPanelWidth) {
      const width = parseInt(newPanelWidth);
      if (this.options.panelWidth === width) return;
      this.options.panelWidth = width;

      const side = this.side;
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      if (!this.layout[`sidebarCover${sideUpperCase}`]) {
        this._onPanelResizeDelay();
      }
      // save
      this.layout.__saveLayoutConfig();
    },
    onPanelResize(panel, newPanelWidth) {
      this.setPanelWidth(newPanelWidth);
    },
    _onPanelResizeDelay: Vue.prototype.$meta.util.debounce(function() {
      this.layout.onResize();
    }, 300),
    _getTopView(skip) {
      if (this.options.views.length === 0) return null;
      return this.options.views.reduce((prev, current) => {
        if (skip && current.id === skip.id) return prev;
        if (!prev) return current;
        return prev.zIndex > current.zIndex ? prev : current;
      }, null);
    },
    _activeView(panel, init) {
      // tab active
      const panelName = this.layout._panelFullName(panel);
      if (this.options.panelActive !== panelName) {
        this.options.panelActive = panelName;
        if (!init) {
          this.layout.__saveLayoutConfig();
        }
      }
    },
  }
}

</script>
