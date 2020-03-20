<script>
import SidebarTabButtons from './sidebarTabButtons.vue';
import SidebarTabSections from './sidebarTabSections.vue';
import SidebarGroup from './SidebarGroup.vue';
import SidebarToolbar from './SidebarToolbar.vue';

export default {
  components: {
    ebSidebarTabButtons: SidebarTabButtons,
    ebSidebarTabSections: SidebarTabSections,
    ebSidebarGroup: SidebarGroup,
    ebSidebarToolbar: SidebarToolbar,
  },
  render(c) {
    const children = [];
    // tabs
    children.push(this._renderSidebarTabs(c));
    // panel
    children.push(this._renderSidebarPanel(c));
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
      views: [],
      dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'),
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
      let size;
      if (this.side === 'left' || this.side === 'right') {
        size = {
          width: this.options.panelWidth,
          height: layout.size.height - this.options.toolbarHeight,
        };
      } else {
        size = {
          width: layout.size.layoutWidth,
          height: this.options.panelHeight,
        };
      }
      return size;
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
    _renderSidebarTabs(c) {
      const children = [];
      // buttons
      const buttons = c('eb-sidebar-tab-buttons', {
        props: {
          side: this.side,
        }
      });
      children.push(buttons);
      // sections
      if (this.side === 'bottom') {
        const sections = c('eb-sidebar-tab-sections', {
          props: {
            side: this.side,
          }
        });
        children.push(sections);
      }
      // tabs
      return c('div', {
        staticClass: 'eb-layout-sidebar-tabs',
      }, children);
    },
    _renderSidebarPanel(c) {
      // toolbar
      const toolbar = c('eb-sidebar-toolbar', {
        props: {
          side: this.side,
        },
      });
      // group
      let style;
      if (this.side === 'left' || this.side === 'right') {
        style = {
          height: `${this.layout.size.height - this.options.toolbarHeight}px`,
          top: `${this.options.toolbarHeight}px`,
        };
      } else {
        style = {
          height: `${this.options.panelHeight-this.options.toolbarHeight}px`,
          top: `${this.options.toolbarHeight}px`,
        };
      }
      const group = c('eb-sidebar-group', {
        ref: 'sidebarGroup',
        props: {
          side: this.side,
        },
        style,
      });
      // resize handler
      const resizeHandler = c('div', {
        staticClass: 'panel-resize-handler',
        directives: [{
          name: 'eb-dragdrop',
          value: {
            scene: this.dragdropSceneResize,
            resizable: true,
            resizeDirection: this._getResizeDirection(),
            onDragStart: this.onDragStartResizable,
            onDragMove: this.onDragMoveResizable,
          }
        }],
      });
      // panel
      const viewSizeExtent = this.viewSizeExtent;
      if (this.side === 'left' || this.side === 'right') {
        style = {
          width: `${viewSizeExtent.width}px`,
        };
      } else {
        style = {
          height: `${viewSizeExtent.height}px`,
        };
      }
      const panel = c('div', {
        staticClass: this._getPanelClassName(),
        style,
      }, [toolbar, group, resizeHandler]);
      return panel;
    },
    createView({ ctx, panel, options, init }) {
      options = options || {};
      // panelName
      const panelName = this.layout._panelFullName(panel);
      // find by name
      const view = this.views.find(item => this.layout._panelFullName(item.panel) === panelName);
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
      const view = this.views.find(item => this.layout._panelFullName(item.panel) === this.layout._panelFullName(panel));
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
      return this.views.find(item => item.id === viewId);
    },
    _getViewIndexById(viewId) {
      return this.views.findIndex(item => item.id === viewId);
    },
    _removeView(viewId) {
      const viewIndex = this._getViewIndexById(viewId);
      if (viewIndex === -1) return;
      this.views.splice(viewIndex, 1);
      if (this.views.length === 0) {
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
      const isRow = this._getResizeDirection() === 'row';
      const width = parseInt(newPanelWidth);
      if (!isRow) {
        if (this.options.panelWidth === width) return;
        this.options.panelWidth = width;
      } else {
        if (this.options.panelHeight === width) return;
        this.options.panelHeight = width;
      }

      const side = this.side;
      const sideUpperCase = side.replace(side[0], side[0].toUpperCase());
      if (!this.layout[`sidebarCover${sideUpperCase}`]) {
        this._onPanelResizeDelay();
      }
      // save
      this.layout.__saveLayoutConfig();
    },
    _onPanelResizeDelay: Vue.prototype.$meta.util.debounce(function() {
      this.layout.onResize();
    }, 300),
    _getTopView(skip) {
      if (this.views.length === 0) return null;
      return this.views.reduce((prev, current) => {
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
    _getPanelClassName() {
      const classNameOpened = this.options.opened ? 'panel-show' : 'panel-hide';
      const classNameSide = `panel-${this.side}`;
      return `panel panel-cover panel-resizable ${classNameSide} ${classNameOpened}`;
    },
    _getResizeDirection() {
      return (this.side === 'left' || this.side === 'right') ? 'column' : 'row';
    },
    onDragStartResizable({ $el, context, dragElement }) {
      const isRow = this._getResizeDirection() === 'row';
      const viewSizeExtent = this.viewSizeExtent;
      const tooltip = isRow ? viewSizeExtent.height : viewSizeExtent.width;
      return { size: null, tooltip };
    },
    onDragMoveResizable({ $el, context, diff }) {
      const isRow = this._getResizeDirection() === 'row';
      if (!isRow) {
        let diffAbs = parseInt(diff.abs.x);
        if (diffAbs === 0) return;
        if (this.side === 'right') diffAbs = -diffAbs;
        const viewSizeExtent = this.viewSizeExtent;
        const newPanelWidth = viewSizeExtent.width + diffAbs;
        this.setPanelWidth(newPanelWidth);
        const tooltip = newPanelWidth;
        return { eaten: true, tooltip };
      } else {
        let diffAbs = parseInt(diff.abs.y);
        if (diffAbs === 0) return;
        if (this.side === 'bottom') diffAbs = -diffAbs;
        const viewSizeExtent = this.viewSizeExtent;
        const newPanelHeight = viewSizeExtent.height + diffAbs;
        this.setPanelWidth(newPanelHeight);
        const tooltip = newPanelHeight;
        return { eaten: true, tooltip };
      }

    },
  }
}

</script>
