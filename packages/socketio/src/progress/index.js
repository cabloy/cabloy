import debounce from '@zhennann/debounce';
import simpleFn from './simple/index.js';

export default (io, options) => {
  const Progress = function () {
    this.initialize = function () {
      options = options || {};
      this.delayTimeout = options.delayTimeout || 500;
      // io simple
      options.enableMessages = false;
      options.onMessageOffset = this._onMessageOffsetDefault;
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

    this._onMessageOffsetDefault = function () {
      return { offset: -1 };
    };

    this._onMessagePushDefault = function () {};
  };
  const progress = new Progress();
  progress.initialize();
  return progress;
};
