import debounce from '@zhennann/debounce';
import simpleFn from './simple/index.js';

export default (io, options) => {
  const Progress = function () {
    this.initialize = function () {
      options = options || {};
      this.delayTimeout = options.delayTimeout || 500;
      this.onSubscribed = options.onSubscribed;
      this.onProgress = options.onProgress;
      // io simple
      this._initializeSimple();
    };
    this._initializeSimple = function () {
      const options = {};
      options.enableMessages = false;
      options.onSubscribed = this._onSubscribedDefault;
      options.onMessagePush = this._onMessagePushDefault;
      this.ioSimple = simpleFn(io, options);
    };
    this.subscribe = function ({ progressId, options }) {
      const path = `/a/progress/update/${progressId}`;
      this.ioSimple.subscribe({ path, options });
    };

    this.unsubscribe = function () {
      this.ioSimple.unsubscribe();
    };

    this._onSubscribedDefault = async function (...args) {
      // custom
      if (this.onSubscribed) {
        const res = await this.onSubscribed(...args);
        if (res) return res;
      }
      // true
      return true;
    };

    this._onMessagePushDefault = function () {};
  };
  const progress = new Progress();
  progress.initialize();
  return progress;
};
