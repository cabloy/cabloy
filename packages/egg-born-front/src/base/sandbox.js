import workerJS from './sandbox.spec.js';
export default function(Vue) {
  window.setTimeout(() => {
    const worker = Vue.prototype.$meta.util.sandbox.getWorker();
    worker.postMessage({
      id: 1,
      expression: 'a+b*2',
      scope: { a: 1, b: 2 },
    });
  }, 0);
  return {
    _worker: null,
    getWorker() {
      if (this._worker) return this._worker;
      const blobURL = Vue.prototype.$meta.util.fn2workerURL(workerJS);
      this._worker = new Worker(blobURL);
      this._worker.onmessage = function(event) {
        console.log('Received: ' + event.data);
      };
      return this._worker;
    },
  };
}
