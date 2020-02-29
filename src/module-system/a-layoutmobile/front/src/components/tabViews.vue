<script>
export default {
  render(c) {
    // links and tabs
    const toolbarLinks = [];
    const tabs = [];
    this.$config.layout.tabs.forEach(tab => {
      // tab id
      const id = `eb-layout-tab-${tab.name}`;
      // link
      const _linkAttrs = this.$utils.extend({}, tab);
      _linkAttrs.text = this.$text(_linkAttrs.text || _linkAttrs.name);
      _linkAttrs.tabLink = `#${id}`;
      toolbarLinks.push(c('f7-link', { attrs: _linkAttrs }));
      // view
      const _viewAttrs = {
        id,
        name: tab.name,
        tab: true,
        'data-url': tab.url,
        init: true,
        tabActive: tab.tabLinkActive,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-size': this.size,
      };
      tabs.push(c('eb-view', {
        key: id,
        staticClass: `eb-layout-tab ${this.layout._combineViewSizeClass()}`,
        attrs: _viewAttrs,
        props: {
          size: this.size,
          sizeExtent: this.sizeExtent,
        },
        on: { 'tab:show': this.onTabShow },
      }));
    });
    // toolbar
    const _toolbarAttrs = this.$utils.extend({}, this.$config.layout.toolbar);
    const toolbar = c('f7-toolbar', { attrs: _toolbarAttrs }, toolbarLinks);
    // views
    return c('f7-views', {
      staticClass: 'eb-layout-scene eb-layout-scene-tool',
      attrs: { tabs: true }
    }, [toolbar, ...tabs]);
  },
  computed: {
    layout() {
      return this.$parent;
    },
    size() {
      return this.$parent.size;
    },
    sizeExtent() {
      return this.$parent.sizeExtent;
    },
  },
  mounted() {
    this.onTabShow();
  },
  methods: {
    onTabShow(el) {
      const target = el ? this.$$(el) : this.$$('.view.eb-layout-tab.tab-active');
      if (target.hasClass('eb-layout-tab')) {
        const path = target[0].f7View.router.currentRoute.path;
        if (!path || path === '/') {
          target[0].f7View.router.navigate(target.data('url'));
        }
      }
    },
  },
};

</script>
<style scoped>
</style>
