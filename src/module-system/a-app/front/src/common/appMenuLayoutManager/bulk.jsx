export default {
  data() {
    return {};
  },
  methods: {
    bulk_onPerformHome() {
      const __appKeyDefault = this.$config.appKey.default;
      this.$meta.vueLayout.app_openHome({
        view: this.$view,
        appKey: __appKeyDefault,
      });
    },
    bulk_onPerformSearch() {
      this.$view.navigate('/a/basefront/atom/searchQuick', {
        target: '_self',
      });
    },
    bulk_renderHome() {
      // backLink
      const backLink = this.$meta.vueLayout.backLink(this.$view);
      if (backLink) return null;
      // childMode
      if (!this.base_isChildMode()) return null;
      return <eb-link key="home" iconF7=":outline:apps-outline" propsOnPerform={this.bulk_onPerformHome}></eb-link>;
    },
    bulk_renderSearch() {
      return <eb-link key="search" iconF7="::search" propsOnPerform={this.bulk_onPerformSearch}></eb-link>;
    },
    bulk_renderActionsNormal() {
      const children = [];
      // home
      children.push(this.bulk_renderHome());
      // search
      children.push(this.bulk_renderSearch());
      // ok
      return children;
    },
  },
};
