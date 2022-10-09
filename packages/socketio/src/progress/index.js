import debounce from '@zhennann/debounce';
import simpleFn from './simple/index.js';

export default (io, options) => {
  const Progress = function () {
    this.initialize = function () {
      options = options || {};
      this.delayTimeout = options.delayTimeout || 500;
    };
    this.subscribe = function ({ path, options }) {};

    this.unsubscribe = function () {};
  };
  const progress = new Progress();
  progress.initialize();
  return progress;
};
