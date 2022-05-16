export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  created() {},
  methods: {
    onPerformHome() {
      const __appKeyDefault = this.$config.appKey.default;
      this.$meta.vueLayout.app_openHome({
        view: this.layoutManager.$view,
        appKey: __appKeyDefault,
      });
    },
    onPerformDashboard() {
      this.$meta.vueLayout.app_openAppHome({
        view: this.layoutManager.$view,
        force: true,
      });
    },
    _renderHome() {
      // backLink
      const backLink = this.$meta.vueLayout.backLink(this.layoutManager.$view);
      if (backLink) return null;
      // childMode
      if (!this.layoutManager.base_isChildMode()) return null;
      return <eb-link key="home" iconF7=":outline:apps-outline" propsOnPerform={this.onPerformHome}></eb-link>;
    },
    _renderDashboard() {
      return <eb-link key="dashboard" iconF7="::dashboard" propsOnPerform={this.onPerformDashboard}></eb-link>;
    },
    _renderNavRight() {
      const children = [];
      // home
      children.push(this._renderHome());
      // dashboard
      //   always show, even if no app home config
      children.push(this._renderDashboard());
      // ok
      return <f7-nav-right>{children}</f7-nav-right>;
    },
  },
  render() {
    return this._renderNavRight();
  },
};
