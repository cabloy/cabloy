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
    computed_register(name, expression, deps, property) {
      // check if exists
      let watchers = this.__computed_dynamics[name];
      if (watchers) return watchers;
      // watchers
      watchers = {};
      for (const depName of deps) {
        watchers[depName] = this.$watch(`data.${depName}`, () => {
          // changed
          const scope = {};
          for (const depName of deps) {
            scope[depName] = this.data[depName];
          }
          this.$meta.util.sandbox.evaluate(expression, scope).then(value => {
            this.setValue(this.data, name, value, property);
          }).catch(err => {
            throw err;
          });
        });
      }
      // ok
      this.__computed_dynamics[name] = watchers;
      return watchers;
    },
    computed_unRegister(name) {
      const watchers = this.__computed_dynamics[name];
      if (watchers) {
        delete this.__computed_dynamics[name];
        for (const depName in watchers) {
          const unwatch = watchers[depName];
          unwatch();
        }
      }
    },
  },
};
