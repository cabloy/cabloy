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
    const panel = c('f7-panel', {
      props: {
        side: this.side,
        //opened: true,
        //backdrop: true,
        visibleBreakpoint: 0,
        //collapsedBreakpoint: 0,
        effect: 'cover', //'reveal',
        resizable: true,
      },
    }, [group]);
    return c('div', { staticClass: `eb-layout-sidebar eb-layout-sidebar-${this.side}` }, [tabs, panel]);
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {
      effect: 'cover',
      views: [],
      panelWidth: 320,
    }
  },
  computed: {
    layout() {
      return this.$parent;
    },
    viewSize() {
      let size;
      const width = this.panelWidth;
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
        width: this.panelWidth,
        height: layout.size.height - layout.size.top,
      };
    }
  },
  mounted() {
    let options = {};
    const url = '/a/base/menu/list';
    this.$refs.sidebarGroup.createView({ ctx: null, url }).then(res => {
      if (res) {
        if (res.options) options = this.$utils.extend({}, options, res.options);
        res.view.f7View.router.navigate(url, options);
      }
    });
  },
}

</script>
