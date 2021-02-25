import Vue from 'vue';
const __PATH_MESSAGE_UNIFORM = '/a/message/uniform';

export default function(io) {
  const Simple = function() {

    this.initialize = function() {
      Vue.prototype.$f7.on('notificationClick', this._onNotificationClick.bind(this));
    };

    this.subscribe = function() {
      const user = Vue.prototype.$meta.store.state.auth.user.op;
      if (user.anonymous) return;
      this.subscribeId = io.subscribe(
        __PATH_MESSAGE_UNIFORM, this._onMessage.bind(this), this._onSubscribed.bind(this)
      );
    };

    this._onMessage = function({ message }) {
      // content
      const content = JSON.parse(message.content);
      // icon
      let icon;
      if (!content.userAvatar) {
        icon = '<i class="material-icons">error</i>';
      } else {
        icon = `<img class="avatar avatar16" src="${content.userAvatar}">`;
      }
      // options
      const options = {
        icon,
        title: content.userName,
        titleRightText: Vue.prototype.$meta.util.formatDateTime(message.createdAt),
        subtitle: content.title,
        text: content.body,
        closeButton: true,
        closeOnClick: true,
        swipeToClose: false,
        _message: message,
        _content: content,
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

    this._onSubscribed = function() {
      // donothing
    };

    this._onNotificationClick = function(notification) {
      // content
      const content = notification.params._content;
      // actionPath
      const actionPath = content.actionPath;
      Vue.prototype.$meta.vueLayout.navigate(actionPath);
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
