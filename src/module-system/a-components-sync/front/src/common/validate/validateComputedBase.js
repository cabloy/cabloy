export default ({ ctx, dataRootName, dataRoot, onDataMeta, onChange }) => {
  class ValidateComputedBase {
    constructor() {
      this.__computed_dynamics = {};
    }

    dispose() {
      for (const dataPath in this.__computed_dynamics) {
        this.unRegister(dataPath);
      }
      this.__computed_dynamics = {};
    }

    register({ parcel, name, expression, dependencies, immediate }) {
      const deps = dependencies ? (Array.isArray(dependencies) ? dependencies : dependencies.split(',')) : [];
      // dataPath
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
        info.watchers[depName] = ctx.$watch(`${dataRootName}.${depName}`, () => {
          // changed
          this.onChangeDeps(dataPath);
        });
      }
      // hold
      this.__computed_dynamics[dataPath] = info;
      // immediate
      if (immediate) {
        this.onChangeDeps(dataPath);
      }
      // ok
      return info;
    }

    fillScope(scope, data, depName) {
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
    }

    onChangeDeps(dataPath) {
      const info = this.__computed_dynamics[dataPath];
      if (!info) return;
      // scope
      const scope = {
        ... dataRoot,
        _meta: onDataMeta(),
      };
      // const scope = {};
      // for (const depName of info.deps) {
      //   this.fillScope(scope, dataRoot, depName);
      // }
      // evaluate
      ctx.$meta.util.sandbox.evaluate(info.expression, scope).then(value => {
        onChange({
          parcel: info.parcel,
          name: info.name,
          value,
        });
      }).catch(err => {
        throw err;
      });
    }

    unRegister(dataPath) {
      const info = this.__computed_dynamics[dataPath];
      if (!info) return;
      delete this.__computed_dynamics[dataPath];
      for (const depName in info.watchers) {
        const unwatch = info.watchers[depName];
        unwatch();
      }
    }

  }

  return ValidateComputedBase;
};
