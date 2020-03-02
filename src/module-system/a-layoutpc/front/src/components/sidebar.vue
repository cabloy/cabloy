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
      staticClass: (this.options.opened || !this.options.cover) ? 'panel-show' : 'panel-hide',
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
        // active
        this._activeView(panel, $view);
        return;
      }
      // new view
      let options = {};
      return this.$refs.sidebarGroup.createView({ ctx, panel }).then(res => {
        if (res) {
          if (res.options) options = this.$utils.extend({}, options, res.options);
          res.view.f7View.router.navigate(panel.url, options);
          // active
          this._activeView(panel, this.$$(res.view.$el));
        }
      });
    },
    _activeView(panel, $view) {
      // view active
      this.$$(`.eb-layout-sidebar-${this.side} .eb-layout-panel-view`).removeClass('active');
      $view.addClass('active');
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
