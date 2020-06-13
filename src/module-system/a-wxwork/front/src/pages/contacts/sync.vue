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
    const action = {
      actionModule: 'a-socketio',
      actionComponent: 'io',
      name: 'helper',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(helper => {
      this.ioHelper = helper;
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
      // socket io
      const path = `/a/wxwork/progress/${this.progressId}`;
      this.ioSimple = this.ioHelper.simple();
      this.ioSimple.subscribe({
        path,
        onMessageOffset: this._onMessageOffset.bind(this),
        onMessageSelect: this._onMessageSelect.bind(this),
        onMessageSetRead: this._onMessageSetRead.bind(this),
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
    _onMessageSetRead({ messageIds }) {
      return this.$api.post('/a/socketio/message/setRead', {
        messageIds,
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
    },
  },
};

</script>
<style>
</style>
