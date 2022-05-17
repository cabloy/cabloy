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
    bulk_onPerformDashboard() {
      this.$meta.vueLayout.app_openAppHome({
        view: this.$view,
        force: true,
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
    bulk_renderDashboard() {
      return <eb-link key="dashboard" iconF7="::dashboard" propsOnPerform={this.bulk_onPerformDashboard}></eb-link>;
    },
    bulk_renderActionsNormal() {
      const children = [];
      // home
      children.push(this._renderHome());
      // dashboard
      //   always show, even if no app home config
      children.push(this._renderDashboard());
      // ok
      return children;
    },
  },
};
