<template>
  <eb-page>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="ioHelper" :onPerform="onPerformSync">{{$text('Sync Now')}}</eb-link>
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
      progressId: null,
      messagesData: [],
      ioHelper: null,
      ioSimple: null,
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
    // io helper
    const action = {
      actionModule: 'a-socketio',
      actionComponent: 'io',
      name: 'helper',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(helper => {
      this.ioHelper = helper;
    });
    // queueScroll
    this._queueScroll = this.$meta.util.queue(this._queueTaskScroll.bind(this));
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
      if (this.ioSimple) return;
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
      // init
      this.messagesData = [];
      this._scroll(true);
      // socket io
      const path = `/a/wxwork/progress/${this.progressId}`;
      this.ioSimple = this.ioHelper.simple();
      this.ioSimple.subscribe({
        path,
        onMessageOffset: this._onMessageOffset.bind(this),
        onMessageSelect: this._onMessageSelect.bind(this),
        onMessagePush: this._onMessagePush.bind(this),
      });
    },
    _stopSubscribe() {
      if (!this.ioSimple) return;
      // unsubscribe
      this.ioSimple.unsubscribe();
      this.ioSimple = null;
    },
    _onMessageOffset() {
      return this.$api.post('/a/socketio/message/offset', {
        messageClass: this.messageClass,
        options: {
          where: {
            messageFilter: this.progressId,
          },
        },
      });
    },
    _onMessageSelect({ offset }) {
      return this.$api.post('/a/socketio/message/select', {
        messageClass: this.messageClass,
        options: {
          offset,
          where: {
            messageFilter: this.progressId,
            messageRead: 0,
          },
        },
      });
    },
    _onMessagePush({ messages, message }) {
      // messages
      this.messagesData = messages;
      // message
      const content = message.content;
      if (content.done === 1 || content.done === -1) {
        // stop subscribe
        this._stopSubscribe();
      }
      // scroll
      this._scroll(false);
    },
    _scroll(init) {
      this.$nextTick(() => {
        this._queueScroll.push(init);
      });
    },
    _queueTaskScroll(init, cb) {
      let scrollTopNew;
      const textarea = this.$$(this.$refs.textarea);
      if (init) {
        scrollTopNew = 0;
      } else {
        scrollTopNew = textarea[0].scrollHeight - textarea[0].offsetHeight;
        if (scrollTopNew <= 0) return cb();
      }
      if (textarea.scrollTop() === scrollTopNew) return cb();
      textarea.scrollTop(scrollTopNew, 300, cb);
    }
  },
};

</script>
<style>
</style>
