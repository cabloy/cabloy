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
      this.progressId = progressId;
      this.counter = 0;
      this.queue = [];
      this.queueHandler = debounce(() => {
        for (const queueItem of this.queue) {
          this._checking(queueItem.item);
        }
        this.queue = [];
      }, this.delayTimeout);
      //
      const path = `/a/progress/update/${progressId}`;
      this.ioSimple.subscribe({ path, options });
    };

    this.unsubscribe = function () {
      this.ioSimple.unsubscribe();
    };
    this._queuePush = function (item) {
      if (!item) return;
      this.counter = item.counter;
      const queueItem = { item, timestamp: Date.now() };
      // push
      const index = this.queue.findIndex(_queueItem => _queueItem.item.counter > item.counter);
      if (index === -1) {
        this.queue.push(queueItem);
      } else {
        this.queue.splice(index, 0, queueItem);
      }
      // check directly
      while (this.queue[0] && this.queue[0].timestamp + 2 * this.delayTimeout < queueItem.timestamp) {
        const queueItem = this.queue.shift();
        this._checking(queueItem.item);
      }
      // queueHandler
      this.queueHandler();
    };
    this._checking = function (item) {
      // data
      const data = item.data ? (typeof item.data === 'string' ? JSON.parse(item.data) : item.data) : {};
      this.onProgress({ item, data });
    };
    this._onSubscribedDefault = async function (...args) {
      // custom
      if (this.onSubscribed) {
        const res = await this.onSubscribed(...args);
        if (res) return res;
      }
      // progress check
      const item = await io.performAction({
        url: '/a/progress/progress/check',
        body: {
          progressId: this.progressId,
          counter: this.counter,
        },
      });
      this._queuePush(item);
      // true
      return true;
    };
    this._onMessagePushDefault = function ({ message }) {
      this._queuePush(message.content);
    };
  };
  const progress = new Progress();
  progress.initialize();
  return progress;
};
