<script>
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
    this.$meta.util.performAction({ ctx: this, action, item: { state: 'login' } }).then(res => {
      this.providers = res;
    });
  },
  render(c) {
    const children = [];
    if (this.providers) {
      // close
      if (this.showClose) {
        children.push(c('f7-icon', {
          staticClass: 'close',
          attrs: {
            material: 'close',
          },
          nativeOn: {
            click: this.onClose,
          },
        }));
      }
      // title
      children.push(c('f7-login-screen-title', {
        domProps: { innerText: this.title },
      }));
      // loginTop
      const loginTop = this.combineLoginTop(c);
      // loginBottom
      const loginBottom = this.combineLoginBottom(c);
      // loginLine
      let loginLine;
      if (loginTop && loginBottom) {
        loginLine = c('div', { staticClass: 'line' }, [c('div', { staticClass: 'text', domProps: { innerText: this.$text('OR') } })]);
      }
      // add top
      if (loginTop) children.push(loginTop);
      // add line and bottom
      let lineAndBottom;
      if (loginLine || loginBottom) {
        const children = [];
        if (loginLine) children.push(loginLine);
        if (loginBottom) children.push(loginBottom);
        lineAndBottom = c('f7-block', children);
      }
      if (lineAndBottom) children.push(lineAndBottom);
    }
    // page
    return c('eb-page', {
      attrs: {
        'login-screen': true,
        'no-toolbar': false,
        'no-navbar': true,
        'no-swipeback': true,
      },
    }, children);
  },
  methods: {
    onClose() {
      this.$f7router.back();
    },
    combineLoginTop(c) {
      if (!this.providers) return null;
      const providers = this.providers.filter(item => item.provider.meta.inline);
      if (providers.length === 0) return null;
      // check length
      if (providers.length === 1) {
        const provider = providers[0];
        return c(provider.component, {
          props: {
            state: this.state,
          },
        });
      }
      // >1
      const buttons = [];
      const tabs = [];
      for (const index in providers) {
        const provider = providers[index];
        buttons.push(c('f7-link', {
          attrs: {
            'tab-link': `#tab-${index}`,
            'tab-link-active': parseInt(index) === 0,
            text: provider.provider.meta.titleLocale,
          },
        }));
        tabs.push(c('f7-tab', {
          attrs: {
            id: `tab-${index}`,
            'tab-active': parseInt(index) === 0,
          },
        }, [c(provider.component, {
          props: {
            state: this.state,
          },
        })]));
      }
      const tabbar = c('f7-toolbar', {
        attrs: {
          top: true,
          tabbar: true,
        },
      }, buttons);
      const tabblock = c('f7-tabs', tabs);
      return c('div', [tabbar, tabblock]);
    },
    combineLoginBottom(c) {
      if (this.state === 'migrate') return null;
      if (!this.providers) return null;
      const providers = this.providers.filter(item => !item.provider.meta.inline);
      if (providers.length === 0) return null;
      // buttons
      const children = [];
      for (const item of providers) {
        children.push(c(item.component, { staticClass: 'btn' }));
      }
      return c('div', { staticClass: 'btns' }, children);
    },
  },
};

</script>
<style>
</style>
