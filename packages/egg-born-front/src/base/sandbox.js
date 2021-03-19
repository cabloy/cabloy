import workerJS from './sandbox.spec.js';
export default function(Vue) {
  return {
    _idCounter: 0,
    _callbacks: {},
    _worker: null,
    getWorker() {
      if (this._worker) return this._worker;
      const blobURL = Vue.prototype.$meta.util.fn2workerURL(workerJS);
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
        const worker = this.getWorker();
        worker.postMessage({ id, expression, scope });
      });
    },
  };
}
