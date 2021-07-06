import nprogress from 'nprogress';
import 'nprogress/nprogress.css';

export default function (Vue) {
  nprogress.configure({ showSpinner: false });
  return {
    _counter: 0,
    _timerId: 0,

    start() {
      if (this._counter++ === 0) {
        this._start();
      }
    },
    done() {
      if (--this._counter === 0) {
        this._done();
      }
    },
    _start() {
      const debounce = Vue.prototype.$meta.config.nprogress.debounce;
      this._clearTimer();
      this._timerId = window.setTimeout(() => {
        nprogress.start();
      }, debounce);
    },
    _done() {
      this._clearTimer();
      nprogress.done();
    },
    _clearTimer() {
      if (this._timerId) {
        window.clearTimeout(this._timerId);
        this._timerId = 0;
      }
    },
  };
}
