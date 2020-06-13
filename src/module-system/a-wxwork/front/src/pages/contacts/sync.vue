<template>
  <eb-page>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="io" :onPerform="onPerformSync">{{$text('Sync Now')}}</eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="progressResult" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      type: this.$f7route.query.type,
      io: null,
      progressId: null,
      subscribeId: null,
      messagesData: [],
      messageOffset: -1,
      messageOffsetPending: -1,
      messageOfflineFetching: false,
      messageIdsToRead: {},
      messageClass: {
        module: 'a-wxwork',
        messageClassName: 'progress',
      },
    };
  },
  computed: {
    progressResult() {
      return this.messagesData.map(item => item.content.text).join('\n');
    },
  },
  created() {
    const action = {
      actionModule: 'a-socketio',
      actionComponent: 'io',
      name: 'instance',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(io => {
      this.io = io;
    });
  },
  beforeDestroy() {
    this._stopSubscribe();
  },
  methods: {
    getPageTitle() {
      const type = this.type === 'departments' ? 'Departments' : 'Members';
      return `${this.$text(type)}: ${this.$text('Sync')}`;
    },
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onPerformSync() {
      if (this.subscribeId) return;
      // init
      this.progressId = null;
      this.messagesData = [];
      this.messageOffset = -1;
      this.messageOffsetPending = -1;
      this.messageOfflineFetching = false;
      this.messageIdsToRead = {};
      // sync
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post(`contacts/sync`, {
          type: this.type,
        }).then(res => {
          this.progressId = res.progressId;
          this._startSubscribe();
        });
      });
    },
    _startSubscribe() {
      // socket io
      const subscribePath = `/a/wxwork/progress/${this.progressId}`;
      this.subscribeId = this.io.subscribe(subscribePath, this._onMessage.bind(this), this._onSubscribed.bind(this));
    },
    _stopSubscribe() {
      if (!this.subscribeId) return;
      // unsubscribe
      this.io.unsubscribe(this.subscribeId);
      this.subscribeId = null;
    },
    _setMessageOffset(offset) {
      if (this.messageOfflineFetching) {
        if (offset > this.messageOffsetPending) this.messageOffsetPending = offset;
        return;
      }
      if (offset > this.messageOffset) {
        this.messageOffset = offset;
      }
    },
    _onMessage({ message }) {
      this._setMessageOffset(message.id);
      this._checking(message);
    },
    _onSubscribed() {
      if (this.messageOfflineFetching) return;
      this.messageOfflineFetching = true;
      // get offset
      if (this.messageOffset === -1) {
        this.$api.post('/a/socketio/message/offset', {
          messageClass: this.messageClass,
          options: {
            where: {
              messageFilter: this.progressId,
            }
          },
        }).then(data => {
          this.messageOffset = data.offset;
          if (this.messageOffset === -1) {
            this._offlineFetchStop();
          } else {
            this._offlineFetch();
          }
        }).catch(err => {
          this._offlineFetchStop();
        });
      } else {
        this._offlineFetch();
      }
    },
    _offlineFetch() {
      this.$api.post('/a/socketio/message/select', {
        messageClass: this.messageClass,
        options: {
          offset: this.messageOffset,
          where: {
            messageFilter: this.progressId,
          }
        },
      }).then(data => {
        // push
        const list = data.list;
        if (list.length > 0) {
          // offset
          this.messageOffset = list[list.length - 1].id;
          for (const message of list) {
            this._checking(message);
          }
        }
        // next
        if (data.finished) {
          this._offlineFetchStop();
        } else {
          this._offlineFetch();
        }
      }).catch(err => {
        this._offlineFetchStop();
      });
    },
    _offlineFetchStop() {
      this.messageOfflineFetching = false;
      this._setMessageOffset(this.messageOffsetPending);
    },
    _pushMessage(message) {
      const inserted = this._insertMessage(message);
      if (!inserted) return false;
      if (typeof message.content === 'string') {
        message.content = JSON.parse(message.content);
      }
      this._messageToRead(message);
      return true;
    },
    _insertMessage(message) {
      let indexBase = -1;
      for (const index = this.messagesData.length - 1; index >= 0; index--) {
        const _message = this.messagesData[index];
        if (_message.id === message.id) {
          return false; // ignore if exists
        }
        if (_message.id < message.id) {
          indexBase = index;
          break;
        }
      }
      console.log(message);
      if (indexBase === -1) {
        this.messagesData.push(message);
      } else {
        this.messagesData.splice(indexBase + 1, 0, message);
      }
    },
    _messageToRead(message) {
      if (message.messageRead === 1) return;
      this.messageIdsToRead[message.id] = true;
      this._performRead();
    },
    _performRead: Vue.prototype.$meta.util.debounce(function() {
      this._performRead2();
    }, 300),
    _performRead2() {
      const messageIds = Object.keys(this.messageIdsToRead);
      this.messageIdsToRead = {};
      this.$api.post('/a/socketio/message/setRead', { messageIds }).then(() => {
        // do nothing
      }).catch(() => {
        // save back
        for (const messageId of messageIds) {
          this.messageIdsToRead[messageId] = true;
        }
      });
    },
    _checking(message) {
      // push message
      const inserted = this._pushMessage(message);
      if (!inserted) return;
      const content = message.content;
      if (content.done === 1 || content.done === -1) {
        // stop subscribe
        this._stopSubscribe();
      }
    }
  },
};

</script>
<style>
</style>
