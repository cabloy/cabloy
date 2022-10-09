import debounce from '@zhennann/debounce';

export default (io, options) => {
  const Simple = function () {
    this.initialize = function (options) {
      options = options || {};
      // messageClass is optional
      this.messageClass = (options && options.messageClass) || null;
      // callback
      this.onMessageOffset = options.onMessageOffset || this._onMessageOffsetDefault;
      this.onMessageSelect = options.onMessageSelect || this._onMessageSelectDefault;
      this.onMessagePush = options.onMessagePush;
    };

    this.subscribe = function ({ path, options }) {
      this.messagesData = [];
      this.messageOffset = -1;
      this.messageOffsetPending = -1;
      this.messageOfflineFetching = false;
      this.messageIdsToRead = {};

      this.subscribeId = io.subscribe(path, this._onMessage.bind(this), this._onSubscribed.bind(this), options);
    };

    this.unsubscribe = function () {
      if (!this.subscribeId) return;
      // unsubscribe
      io.unsubscribe(this.subscribeId);
      this.subscribeId = null;
    };

    this._onMessageOffsetDefault = async function () {
      return await io.performAction({
        url: '/a/socketio/message/offset',
        body: {
          messageClass: this.messageClass,
        },
      });
    };

    this._onMessageSelectDefault = async function () {
      return await io.performAction({
        url: '/a/socketio/message/select',
        body: {
          messageClass: this.messageClass,
          options: {
            offset: this.messageOffset,
          },
        },
      });
    };

    this._onMessage = function ({ message }) {
      this._setMessageOffset(message.id);
      this._pushMessage(message);
    };

    this._onSubscribed = async function () {
      if (this.messageOfflineFetching) return;
      this.messageOfflineFetching = true;
      // maybe messages are sent out of order, so need re-receive offset again
      // // offset
      // if (this.messageOffset > -1) {
      //   await this._offlineFetch();
      //   return;
      // }
      // get offset
      try {
        const data = await this.onMessageOffset();
        this.messageOffset = data.offset;
        if (this.messageOffset === -1) {
          this._offlineFetchStop();
        } else {
          await this._offlineFetch();
        }
      } catch (err) {
        this._offlineFetchStop();
      }
    };

    this._offlineFetch = async function () {
      try {
        const data = await this.onMessageSelect({ offset: this.messageOffset });
        // push
        const list = data.list;
        if (list.length > 0) {
          // offset
          this.messageOffset = list[list.length - 1].id;
          for (const message of list) {
            this._pushMessage(message);
          }
        }
        // next
        if (data.finished) {
          this._offlineFetchStop();
        } else {
          await this._offlineFetch();
        }
      } catch (err) {
        this._offlineFetchStop();
      }
    };

    this._offlineFetchStop = function () {
      this.messageOfflineFetching = false;
      this._setMessageOffset(this.messageOffsetPending);
      this.messageOffsetPending = -1;
    };

    this.setMessageOffset = function (offset) {
      return this._setMessageOffset(offset);
    };

    this._setMessageOffset = function (offset) {
      if (this.messageOfflineFetching) {
        if (offset > this.messageOffsetPending) this.messageOffsetPending = offset;
        return;
      }
      if (offset > this.messageOffset) {
        this.messageOffset = offset;
      }
    };

    this.pushMessage = function (message) {
      return this._pushMessage(message);
    };

    this._pushMessage = function (message) {
      // insert
      const inserted = this._insertMessage(message);
      if (!inserted) return false;
      // convert content
      if (typeof message.content === 'string') {
        message.content = JSON.parse(message.content);
      }
      // read
      this._messageToRead(message);
      // callback
      this.onMessagePush({ messages: this.messagesData, message });
      // ok
      return true;
    };

    this._insertMessage = function (message) {
      if (!message.id) {
        this.messagesData.push(message);
        return true;
      }
      let indexBase = -1;
      for (let index = this.messagesData.length - 1; index >= 0; index--) {
        const _message = this.messagesData[index];
        if (_message.id === message.id) {
          return false; // ignore if exists
        }
        if (_message.id < message.id) {
          indexBase = index;
          break;
        }
      }
      this.messagesData.splice(indexBase + 1, 0, message);
      return true;
    };

    this._messageToRead = function (message) {
      if (!message.id || message.messageRead === 1 || message.persistence === false) return;
      this.messageIdsToRead[message.id] = true;
      this._performRead();
    };

    this._performRead = debounce(() => {
      this._performRead2();
    }, 300);

    this._performRead2 = async function () {
      const messageIds = Object.keys(this.messageIdsToRead);
      this.messageIdsToRead = {};
      try {
        await io.performAction({
          url: '/a/socketio/message/setRead',
          body: {
            messageClass: this.messageClass,
            messageIds,
          },
        });
      } catch (err) {
        // save back
        for (const messageId of messageIds) {
          this.messageIdsToRead[messageId] = true;
        }
      }
    };
  };
  const simple = new Simple();
  simple.initialize(options);
  return simple;
};
