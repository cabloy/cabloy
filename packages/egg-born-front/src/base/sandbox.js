import workerJS from './sandbox.spec.js';
export default function (Vue) {
  return {
    _idCounter: 0,
    _callbacks: {},
    _worker: null,
    getWorker() {
      if (this._worker) return this._worker;
      const blobURL = Vue.prototype.$meta.util.fn2workerURL(workerJS.toString());
      this._worker = new Worker(blobURL);
      this._worker.onmessage = event => {
        const { id, err, value } = event.data;
        const cb = this._callbacks[id];
        if (cb) {
          delete this._callbacks[id];
          cb.callback(err, value);
        }
      };
      return this._worker;
    },
    evaluate(expression, scope) {
      return new Promise((resolve, reject) => {
        // id
        const id = ++this._idCounter;
        // callback
        this._callbacks[id] = {
          callback: (err, value) => {
            if (err) return reject(new Error(err.message));
            resolve(value);
          },
        };
        // scope
        scope = this._purgeScope(scope);
        const worker = this.getWorker();
        worker.postMessage({ id, expression, scope });
      });
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
  };
}
