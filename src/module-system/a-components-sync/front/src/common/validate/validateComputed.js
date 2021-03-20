export default {
  data() {
    return {
    };
  },
  created() {
    this.__computed_dynamics = {};
  },
  beforeDestroy() {
    for (const dataPath in this.__computed_dynamics) {
      this.computed_unRegister(dataPath);
    }
    this.__computed_dynamics = null;
  },
  methods: {
    computed_register(parcel, name, expression, deps, immediate) {
      const dataPath = parcel.pathParent + name;
      // check if exists
      let info = this.__computed_dynamics[dataPath];
      if (info) return info;
      // info
      info = {
        parcel, name,
        expression, deps, immediate,
        watchers: {},
      };
      for (const depName of deps) {
        info.watchers[depName] = this.$watch(`parcel.data.${depName}`, () => {
          // changed
          this.computed_onChange(dataPath);
        });
      }
      // hold
      this.__computed_dynamics[dataPath] = info;
      // immediate
      if (immediate) {
        this.computed_onChange(dataPath);
      }
      // ok
      return info;
    },
    computed_fillScope(scope, data, depName) {
      const depNames = depName.split('.');
      if (depNames.length === 1) {
        scope[depName] = data[depName];
        return;
      }
      for (let i = 0; i < depNames.length - 1; i++) {
        const depName = depNames[i];
        if (!scope[depName]) {
          scope[depName] = {};
        }
        scope = scope[depName];
        data = data[depName];
      }
      const depNameLast = depNames[depNames.length - 1];
      scope[depNameLast] = data[depNameLast];
    },
    computed_onChange(dataPath) {
      const info = this.__computed_dynamics[dataPath];
      if (!info) return;
      // scope
      const scope = {};
      for (const depName of info.deps) {
        this.computed_fillScope(scope, this.parcel.data, depName);
      }
      // evaluate
      this.$meta.util.sandbox.evaluate(info.expression, scope).then(value => {
        this.setValue(info.parcel, info.name, value);
      }).catch(err => {
        throw err;
      });
    },
    computed_unRegister(dataPath) {
      const info = this.__computed_dynamics[dataPath];
      if (!info) return;
      delete this.__computed_dynamics[dataPath];
      for (const depName in info.watchers) {
        const unwatch = info.watchers[depName];
        unwatch();
      }
    },
  },
};
