export default {
  data() {
    return {};
  },
  methods: {
    bulk_onPerformAppDefault() {
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
    bulk_renderAppDefault() {
      // layout
      if (this.$meta.vueApp.layout !== 'mobile') return null;
      // backLink
      const backLink = this.$meta.vueLayout.backLink(this.$view);
      if (backLink) return null;
      // childMode
      if (!this.base_isChildMode()) return null;
      return (
        <eb-link
          key="appDefault"
          iconF7=":outline:apps-outline"
          propsOnPerform={this.bulk_onPerformAppDefault}
        ></eb-link>
      );
    },
    bulk_renderSearch() {
      // layout
      if (this.$meta.vueApp.layout !== 'mobile') return null;
      return <eb-link key="search" iconF7="::search" propsOnPerform={this.bulk_onPerformSearch}></eb-link>;
    },
    bulk_renderActionsNormal() {
      const children = [];
      // appDefault
      children.push(this.bulk_renderAppDefault());
      // search
      children.push(this.bulk_renderSearch());
      // ok
      return children;
    },
  },
};
