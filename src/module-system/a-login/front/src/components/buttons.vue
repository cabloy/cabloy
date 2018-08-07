<script>
export default {
  meta: {
    global: false,
  },
  props: {
    loginSimple: {
      type: Boolean,
      default: false,
    },
  },
  render(c) {
    if (!this.btns || this.btns.length === 0) return c('div');
    const btns = [];
    for (const btn of this.btns) {
      btns.push(c(btn, {
        staticClass: 'btn',
      }));
    }
    const children = [];
    if (this.loginSimple) {
      children.push(c('div', { staticClass: 'line' }, [ c('div', { staticClass: 'text', domProps: { innerText: this.$text('or') } }) ]));
    }
    children.push(c('div', { staticClass: 'btns' }, btns));
    return c('div', children);
  },
  data() {
    return {
      btns: null,
    };
  },
  methods: {
    checkDisable(component, cb) {
      if (!component.meta) return cb(false);
      if (typeof component.meta.disable !== 'function') return cb(component.meta.disable);
      this.$meta.util.wrapPromise(component.meta.disable()).then(res => cb(res));
    },
  },
  created() {
    const self = this;
    const provider = this.$config.provider;
    // buttons
    if (provider.buttons) {
      const _handler = function(key, item) {
        return function(resolve, reject) {
          self.$meta.module.use(item.module, module => {
            const component = module.options.components[item.component];
            self.checkDisable(component, disable => {
              if (!disable) {
                self.$options.components[key] = component;
                resolve(key);
              } else {
                resolve(null);
              }
            });
          });
        };
      };
      const promises = [];
      for (const key in provider.buttons) {
        const item = provider.buttons[key];
        if (item) promises.push(new Promise(_handler(key, item)));
      }
      Promise.all(promises).then(function(keys) {
        self.btns = keys.filter(key => key);
      });
    }
  },
};

</script>
<style lang="less" scoped>
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
