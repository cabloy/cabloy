<script>
export default {
  meta: {
    title: 'Sign in',
  },
  data() {
    return {
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
    // list
    return this.$api.post('auth/list').then(list => {
      // load providers
      if (list.length === 0) return;
      this.loadProviders(list).then(providers => {
        this.providers = providers.filter(item => !!item);
      });
    });
  },
  render(c) {
    const children = [];
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
      loginLine = c('div', { staticClass: 'line' }, [ c('div', { staticClass: 'text', domProps: { innerText: this.$text('or') } }) ]);
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
    // page
    return c('eb-page', {
      attrs: {
        'login-screen': true,
        'no-toolbar': true,
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
      const providers = this.providers.filter(item => item.provider.meta.mode === 'direct');
      if (providers.length === 0) return null;
      // check length
      if (providers.length === 1) {
        const provider = providers[0];
        return c(provider.component);
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
        }, [ c(provider.component) ]));
      }
      const tabbar = c('f7-toolbar', {
        attrs: {
          top: true,
          tabbar: true,
        },
      }, buttons);
      const tabblock = c('f7-tabs', tabs);
      return c('div', [ tabbar, tabblock ]);
    },
    combineLoginBottom(c) {
      if (!this.providers) return null;
      const providers = this.providers.filter(item => item.provider.meta.mode === 'redirect');
      if (providers.length === 0) return null;
      // buttons
      const children = [];
      for (const item of providers) {
        children.push(c(item.component, { staticClass: 'btn' }));
      }
      return c('div', { staticClass: 'btns' }, children);
    },
    loadProviders(list) {
      const promises = [];
      for (const item of list) {
        if (item) promises.push(this._loadProvider(item));
      }
      return Promise.all(promises);
    },
    _loadProvider(item) {
      return new Promise((resolve, reject) => {
        // load module
        this.$meta.module.use(item.module, module => {
          // checkIfDisable
          const component = module.options.components[item.meta.component];
          this._checkIfDisable(component).then(disable => {
            if (!disable) {
              resolve({ provider: item, component });
            } else {
              resolve(null);
            }
          });
        });
      });
    },
    _checkIfDisable(component) {
      return new Promise((resolve, reject) => {
        if (!component.meta) return resolve(false);
        if (typeof component.meta.disable !== 'function') return resolve(component.meta.disable);
        this.$meta.util.wrapPromise(component.meta.disable()).then(res => resolve(res));
      });
    },
  },
};

</script>
<style lang="less" scoped>
.close {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
}

.line {
  height: 1px;
  margin: 30px 0;
  text-align: center;
  border-top: 1px solid #e2e2e2;

  .text {
    position: relative;
    top: -10px;
    background: #fff;
    display: inline-block;
    padding: 0 8px;
  }
}

.btns {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 30px;

  .btn {
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
}

</style>
