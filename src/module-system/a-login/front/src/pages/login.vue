<script>
export default {
  meta: {
    title: 'Sign in',
  },
  data() {
    return {
      items: null,
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
      //
    });
    const provider = this.$config.provider;
    // simple
    if (provider.simple) {
      this.$meta.module.use(provider.simple.module, module => {
        this.$options.components.loginSimple = module.options.components[provider.simple.component];
        this.loginSimple = true;
      });
    }
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
    const loginTop = this.combineLoginTop();
    // loginBottom
    const loginBottom = this.combineLoginBottom();
    // loginLine
    let loginLine;
    if (loginTop && loginBottom) {
      loginLine = c('div', { staticClass: 'line' }, [ c('div', { staticClass: 'text', domProps: { innerText: this.$text('or') } }) ]);
    }
    // add
    if (loginTop) children.push(loginTop);
    if (loginLine) children.push(loginLine);
    if (loginBottom) children.push(loginBottom);
    // page
    const page = c('eb-page', {
      attrs: {
        'login-screen': true,
        'no-toolbar': true,
        'no-navbar': true,
        'no-swipeback': true,
      },
    }, children);
    return page;
    // if (!this.btns || this.btns.length === 0) return c('div');
    // const btns = [];
    // for (const btn of this.btns) {
    //   btns.push(c(btn, {
    //     staticClass: 'btn',
    //   }));
    // }
    // const children = [];
    // if (this.loginSimple) {
    //   children.push(c('div', { staticClass: 'line' }, [ c('div', { staticClass: 'text', domProps: { innerText: this.$text('or') } }) ]));
    // }
    // children.push(c('div', { staticClass: 'btns' }, btns));
    // return c('div', children);
  },
  methods: {
    onClose() {
      this.$f7router.back();
    },
    combineLoginTop() {

    },
    combineLoginBottom() {

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

  .btn {
    width: 36px;
    height: 36px;
    cursor: pointer;
  }
}

</style>
