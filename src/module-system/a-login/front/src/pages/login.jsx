export default {
  meta: {
    title: 'Sign In',
  },
  data() {
    return {
      state: this.$f7route.query.state || 'login',
      providers: null,
      showClose: false,
    };
  },
  computed: {
    title() {
      return this.$store.getters['auth/title'];
    },
  },
  mounted() {
    this.showClose = this.$meta.vueLayout.backLink(this);
  },
  created() {
    const action = {
      actionModule: 'a-login',
      actionComponent: 'ebAuthProviders',
      name: 'loadAuthProviders',
    };
    this.$meta.util.performAction({ ctx: this, action, item: { state: this.state } }).then(res => {
      this.providers = res;
    });
  },
  render() {
    return (
      <eb-page login-screen={true} no-toolbar={false} no-navbar={true} no-swipeback={true}>
        {this._renderContainer()}
      </eb-page>
    );
  },
  methods: {
    onClose() {
      this.$f7router.back();
    },
    _renderLoginTop_single(providers) {
      const { provider } = providers[0];
      const options = { props: { state: this.state } };
      return <eb-component module={provider.module} name={provider.meta.component} options={options}></eb-component>;
    },
    _renderLoginTop_multiple(providers) {
      const domButtons = [];
      const domTabs = [];
      for (const index in providers) {
        const { provider } = providers[index];
        domButtons.push(
          <f7-link tab-link={`#tab-${index}`} tab-link-active={parseInt(index) === 0}>
            {provider.meta.titleLocale}
          </f7-link>
        );
        const options = { props: { state: this.state } };
        domTabs.push(
          <f7-tab id={`tab-${index}`} tab-active={parseInt(index) === 0}>
            <eb-component module={provider.module} name={provider.meta.component} options={options}></eb-component>;
          </f7-tab>
        );
      }
      return (
        <div>
          <f7-toolbar top tabbar>
            {domButtons}
          </f7-toolbar>
          <f7-tabs>{domTabs}</f7-tabs>
        </div>
      );
    },
    _renderLoginTop() {
      if (!this.providers) return null;
      // providers
      const providers = this.providers.filter(item => item.provider.meta.inline);
      if (providers.length === 0) return null;
      // check length
      if (providers.length === 1) {
        return this._renderLoginTop_single(providers);
      }
      return this._renderLoginTop_multiple(providers);
    },
    _renderLoginBottom(c) {
      if (this.state === 'migrate') return null;
      if (!this.providers) return null;
      const providers = this.providers.filter(item => !item.provider.meta.inline);
      if (providers.length === 0) return null;
      // buttons
      const domButtons = [];
      for (const item of providers) {
        const { provider } = item;
        const options = { attrs: { class: 'btn' } };
        domButtons.push(
          <eb-component module={provider.module} name={provider.meta.component} options={options}></eb-component>
        );
      }
      return <div class="btns">{domButtons}</div>;
    },
    _renderContainer() {
      if (!this.providers) return null;
      // close
      let domClose;
      if (this.showClose) {
        domClose = (
          <f7-link class="close" iconMaterial="chevron_left" onClick={this.onClose}>
            {this.$text('LookAround')}
          </f7-link>
        );
      }
      // title
      let domTitle = <f7-login-screen-title>{this.title}</f7-login-screen-title>;
      // title sub
      let domTitleSub;
      if (this.state === 'migrate') {
        domTitleSub = (
          <f7-login-screen-title class="sub-title">{this.$text('SignInTheTargetAccount')}</f7-login-screen-title>
        );
      }
      // loginTop
      const domLoginTop = this._renderLoginTop();
      // loginBottom
      const domLoginBottom = this._renderLoginBottom();
      // loginLine
      let domLoginLine;
      if (domLoginTop && domLoginBottom) {
        domLoginLine = (
          <div class="line">
            <div class="text">{this.$text('OR')}</div>
          </div>
        );
      }
      // lineAndBottom
      let domLineAndBottom;
      if (domLoginLine || domLoginBottom) {
        domLineAndBottom = (
          <f7-block>
            {domLoginLine}
            {domLoginBottom}
          </f7-block>
        );
      }
      // container
      return (
        <div class="eb-login-container">
          {domClose}
          {domTitle}
          {domLoginTop}
          {domLineAndBottom}
        </div>
      );
    },
  },
};
