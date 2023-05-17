import Vue from 'vue';
import sandbox from 'sandbox-webworker';

export default {
  state() {
    return {};
  },
  actions: {
    async evaluate(expression, scope) {
      // scope
      scope = this._purgeScope(scope);
      return await sandbox.evaluate(expression, scope);
    },
    _purgeScope(scope) {
      scope = Vue.prototype.$meta.util.extend({}, scope);
      this.__purgeScope(scope);
      return scope;
    },
    __purgeScope(obj) {
      for (const key in obj) {
        obj[key] = this.__purgeValue(obj[key]);
      }
    },
    __purgeValue(value) {
      if (!value) return value;
      if (typeof value === 'object' && !(value instanceof Date)) {
        const typeName = Object.getPrototypeOf(value).constructor.name;
        if (typeName === 'VueComponent' || typeName === 'Vue') {
          return undefined;
        }
        this.__purgeScope(value);
      } else if (Array.isArray(value)) {
        for (let index = 0; index < value.length; index++) {
          value[index] = this.__purgeValue(value[index]);
        }
      }
      return value;
    },
  },
};
