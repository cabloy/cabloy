export default {
  data() {
    return {
    };
  },
  created() {
    this.__computed_dynamics = {};
  },
  beforeDestroy() {
    for (const name in this.__computed_dynamics) {
      this.computed_unRegister(name);
    }
    this.__computed_dynamics = null;
  },
  methods: {
    computed_register(name, expression, deps, immediate, property) {
      // check if exists
      let info = this.__computed_dynamics[name];
      if (info) return info;
      // info
      info = {
        expression, deps, immediate, property,
        watchers: {},
      };
      for (const depName of deps) {
        info.watchers[depName] = this.$watch(`data.${depName}`, () => {
          // changed
          this.computed_onChange(name);
        });
      }
      // hold
      this.__computed_dynamics[name] = info;
      // immediate
      if (immediate) {
        this.computed_onChange(name);
      }
      // ok
      return info;
    },
    computed_onChange(name) {
      const info = this.__computed_dynamics[name];
      if (!info) return;
      // scope
      const scope = {};
      for (const depName of info.deps) {
        scope[depName] = this.data[depName];
      }
      // evaluate
      this.$meta.util.sandbox.evaluate(info.expression, scope).then(value => {
        this.setValue(this.data, name, value, info.property);
      }).catch(err => {
        throw err;
      });
    },
    computed_unRegister(name) {
      const info = this.__computed_dynamics[name];
      if (!info) return;
      delete this.__computed_dynamics[name];
      for (const depName in info.watchers) {
        const unwatch = info.watchers[depName];
        unwatch();
      }
    },
  },
};
