<script>
import SidebarTabs from './sidebarTabs.vue';
import SidebarGroup from './SidebarGroup.vue';

export default {
  components: {
    ebSidebarTabs: SidebarTabs,
    ebSidebarGroup: SidebarGroup,
  },
  render(c) {
    const tabs = c('eb-sidebar-tabs', {
      props: {
        side: this.side,
      },
    });
    const group = c('eb-sidebar-group', {
      ref: 'sidebarGroup',
      props: {
        side: this.side,
      }
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
    }, [group]);
    return c('div', { staticClass: `eb-layout-sidebar eb-layout-sidebar-${this.side}` }, [tabs, panel]);
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
    return {}
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
        height: layout.size.height - layout.size.top,
      };
    }
  },
  mounted() {

  },
  methods: {
    createView({ ctx, panel }) {
      // panelName
      const panelName = this._panelFullName(panel);
      // find by name
      const view = this.options.views.find(item => this._panelFullName(item.panel) === panelName);
      if (view) {
        const $view = this.$$(`#${view.id}`);
        // navigate
        if (panel.url && panel.url !== view.panel.url) {
          $view[0].f7View.router.navigate(panel.url, { reloadAll: true });
        }
        // change zIndex
        view.zIndex = ++this.$refs.sidebarGroup.viewIndex;
        // active
        this._activeView(panel);
        return;
      }
      // new view
      let options = {};
      return this.$refs.sidebarGroup.createView({ ctx, panel }).then(res => {
        if (res) {
          if (res.options) options = this.$utils.extend({}, options, res.options);
          res.view.f7View.router.navigate(panel.url, options);
          // active
          this._activeView(panel);
        }
      });
    },
    closeView(view) {
      // view
      const $view = this.$$(view.$el);
      const viewIndex = parseInt($view.data('index'));
      const _view = this.options.views[viewIndex];
      // top view
      const _viewTop = this._getTopView(_view);
      if (_viewTop) {
        this._activeView(_viewTop.panel);
      }
      // close
      $view.addClass('eb-transition-close').animationEnd(() => {
        // remove
        this.options.views.splice(viewIndex, 1);
        if (this.options.views.length === 0) {
          this.options.opened = false;
        }
        // remove panel
        const panelIndex = this.options.panels.findIndex(item => this._panelFullName(item) === this._panelFullName(_view.panel));
        this.options.panels.splice(panelIndex, 1);
        if (this.options.panels.length === 0) {
          this.layout.onResize();
        }
      });
    },
    _getTopView(skip) {
      if (this.options.views.length === 0) return null;
      return this.options.views.reduce((prev, current) => {
        if (current.id === skip.id) return prev;
        if (!prev) return current;
        return prev.zIndex > current.zIndex ? prev : current;
      }, null);
    },
    _activeView(panel) {
      // tab active
      this.options.panelActive = this._panelFullName(panel);
      // opened
      this.options.opened = true;
    },
    _panelFullName(panel) {
      if (panel.module) return `${panel.module}:${panel.name}`;
      return panel.name;
    }
  }
}

</script>
