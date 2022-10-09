import debounce from '@zhennann/debounce';

export default (io, options) => {
  const Progress = function () {
    this.initialize = function (options) {};
    this.subscribe = function ({ path, options }) {};

    this.unsubscribe = function () {};
  };
  const progress = new Progress();
  progress.initialize(options);
  return progress;
};
