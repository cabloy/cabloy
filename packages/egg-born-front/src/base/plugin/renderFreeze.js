let Vue;
// install
function install(_Vue) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.mixin({
    data() {
      return {
        __renderFreeze: 0,
      };
    },
    created() {
      const self = this;
      self.__renderFreeze_createElement = self.$createElement;
      self.$createElement = function (...argv) {
        if (self.$data.__renderFreeze === 0) {
          return self.__renderFreeze_createElement(...argv);
        }
        if (!self.__renderFreeze_snapshot) {
          self.__renderFreeze_snapshot = self.__renderFreeze_createElement(...argv);
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
    },
  });
}

// export
export default {
  install,
};
