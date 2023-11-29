let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    data() {
      return {
        // eslint-disable-next-line
        __renderFreeze: 0,
      };
    },
    created() {
      const self = this;
      self.__renderFreeze_render = self.$options.render;
      self.$options.render = function (...args) {
        if (self.$data.__renderFreeze === 0) {
          return self.__renderFreeze_render(...args);
        }
        if (!self.__renderFreeze_snapshot) {
          self.__renderFreeze_snapshot = self.__renderFreeze_render(...args);
        }
        return self.__renderFreeze_snapshot;
      };
    },
    beforeDestroy() {
      const self = this;
      if (self.__renderFreeze_snapshot) {
        self.__renderFreeze_snapshot = null;
      }
    },
    methods: {
      renderFreeze(freeze) {
        const self = this;
        if (freeze) {
          if (self.$data.__renderFreeze === 0) {
            self.__renderFreeze_snapshot = null;
          }
          self.$data.__renderFreeze++;
        } else {
          self.$data.__renderFreeze--;
          if (self.$data.__renderFreeze === 0) {
            self.__renderFreeze_snapshot = null;
          }
        }
      },
      async renderFreezeBegin(cb) {
        const self = this;
        try {
          self.renderFreeze(true);
          await cb();
          // maybe called in another vue component context
          // await cb.call(self);
        } finally {
          self.renderFreeze(false);
        }
      },
    },
  });
}

// export
export default {
  install,
};
