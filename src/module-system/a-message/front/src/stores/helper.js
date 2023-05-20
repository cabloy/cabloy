import Vue from 'vue';
const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

export default function (io) {
  const Simple = function () {
    // callbacks
    this._callbackCounter = 0;
    this._callbacksAll = {};
    this._callbacksMap = {};

    this.initialize = function () {
      Vue.prototype.$f7.on('notificationClick', this._onNotificationClick.bind(this));
    };

    this.subscribe = function () {
      const user = Vue.prototype.$meta.store.state.auth.user.op;
      if (user.anonymous) return;
      this.subscribeId = io.subscribe(
        __PATH_MESSAGE_UNIFORM,
        this._onMessage.bind(this),
        this._onSubscribed.bind(this)
      );
    };

    this.reset = function () {
      this._callbacksAll = {};
      this._callbacksMap = {};
    };

    this.register = function (messageClassName, callback) {
      if (!messageClassName) throw new Error('messageClassName not empty');
      if (!this._callbacksAll[messageClassName]) {
        this._callbacksAll[messageClassName] = [];
      }
      const callbackId = ++this._callbackCounter;
      this._callbacksAll[messageClassName].push({
        id: callbackId,
        callback,
      });
      this._callbacksMap[callbackId] = messageClassName;
      return callbackId;
    };

    this.unRegister = function (callbackId) {
      const messageClassName = this._callbacksMap[callbackId];
      if (!messageClassName) return;
      // delete from map
      delete this._callbacksMap[callbackId];
      // delete from all
      const callbacks = this._callbacksAll[messageClassName];
      if (!callbacks) return;
      const index = callbacks.findIndex(item => item.id === callbackId);
      if (index === -1) return;
      callbacks.splice(index, 1);
    };

    this._onMessage = async function ({ message }) {
      // content
      const content = JSON.parse(message.content);
      // callbacks
      const res = await this._performCallbacks({ scene: 'show', message, content });
      if (res) return;
      // icon
      let icon;
      if (!content.issuerAvatar) {
        icon = await Vue.prototype.$meta.util.combineIcon({ f7: '::info-circle', size: '16' });
      } else {
        icon = `<img class="avatar avatar16" src="${content.issuerAvatar}">`;
      }
      // options
      const options = {
        icon,
        title: content.issuerName,
        titleRightText: Vue.prototype.$meta.util.formatDateTime(message.createdAt),
        subtitle: content.title,
        text: content.body,
        closeButton: true,
        closeOnClick: true,
        swipeToClose: false,
        _message: message,
        _content: content,
        'a-message:helper': true,
        on: {
          closed(notification) {
            notification.destroy();
          },
        },
      };
      // closeTimeout
      const closeTimeout = Vue.prototype.$meta.config.modules['a-message'].notification.closeTimeout;
      if (closeTimeout !== -1) {
        options.closeTimeout = closeTimeout;
      }
      // notification
      const notification = Vue.prototype.$f7.notification.create(options);
      notification.open();
    };

    this._onSubscribed = function () {
      // donothing
    };

    this._onNotificationClick = async function (notification) {
      if (!notification.params['a-message:helper']) return;
      // message
      const message = notification.params._message;
      // content
      const content = notification.params._content;
      // open
      await this._openMessage({ message, content });
    };

    this._openMessage = async function ({ message, content, options }) {
      // setRead
      if (message.id && message.messageRead !== 1 && message.persistence !== false) {
        await Vue.prototype.$meta.api.post('/a/socketio/message/setRead', {
          messageClass: {
            id: message.messageClassId,
          },
          messageIds: [message.id],
        });
      }
      // callbacks
      const res = await this._performCallbacks({ scene: 'click', message, content });
      if (res) return;
      // actionPath
      const actionPath = content.actionPath;
      if (actionPath) {
        // navigateOptions
        const navigateOptions = options && options.navigate;
        Vue.prototype.$meta.vueLayout.navigate(actionPath, navigateOptions);
      }
    };

    // res=true: break the default handler
    this._performCallbacks = async function ({ scene, message, content }) {
      const messageClassName = `${message.module}:${message.messageClassName}`;
      const callbacks = this._callbacksAll[messageClassName];
      if (!callbacks) return;
      let res = false;
      for (const item of callbacks) {
        const _res = await item.callback({ scene, message, content });
        if (_res === true) {
          res = true;
        }
      }
      return res;
    };
  };
  return {
    simple() {
      const simple = new Simple();
      simple.initialize();
      return simple;
    },
  };
}
