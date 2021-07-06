module.exports = () => {
  class FlowVars {
    constructor() {
      this._vars = null;
      this._dirty = false;
    }

    get(names) {
      names = names.split('.');
      let value = this._vars;
      for (const name of names) {
        value = value[name];
        if (value === undefined) break;
      }
      return value;
    }

    set(names, value) {
      names = names.split('.');
      let obj = this._vars;
      for (let i = 0; i < names.length - 1; i++) {
        const name = names[i];
        if (obj[name] === undefined) {
          obj[name] = {};
        }
        obj = obj[name];
      }
      const name = names[names.length - 1];
      obj[name] = value;
      // dirty
      this._dirty = true;
    }
  }
  return FlowVars;
};
