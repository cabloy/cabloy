<template>
  <eb-page>
    <eb-navbar :title="getPageTitle()" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="io" :onPerform="onPerformSync">{{$text('Sync Now')}}</eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      type: this.$f7route.query.type,
      content: '',
      io: null,
      progressId: null,
      progressCounter: 0,
      subscribeId: null,
    };
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
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post(`contacts/sync`, {
          type: this.type,
        }).then(res => {
          this.progressId = res.progressId;
          this.progressCounter = 0;
          this._startSubscribe();
        });
      });
    },
    _startSubscribe() {
      // socket io
      const subscribePath = `/a/progress/update/${this.progressId}`;
      this.subscribeId = this.io.subscribe(subscribePath, this._onMessage.bind(this), this._onSubscribed.bind(this));
    },
    _stopSubscribe() {
      if (!this.subscribeId) return;
      // unsubscribe
      this.io.unsubscribe(this.subscribeId);
      this.subscribeId = null;
      // delete progress
      this.$api.post('/a/progress/progress/delete', { progressId: this.progressId }).then(() => {
        // donothing
      }).catch(() => {
        // donothing
      });
    },
    _onMessage({ message }) {
      const item = JSON.parse(message.content);
      this._checking(item);
    },
    _onSubscribed() {
      this.$api.post('/a/progress/progress/check', {
        progressId: this.progressId,
        counter: this.progressCounter,
      }).then(item => {
        this._checking(item);
      }).catch(() => {
        // donothing
      });
    },
    _checking(item) {
      console.log(item);
      if (!item) return;
      if (item.counter > this.progressCounter) {
        this.progressCounter = item.counter;
      }
      const data = item.data ? (typeof item.data === 'string' ? JSON.parse(item.data) : item.data) : {};
      if (item.done === 0) {
        this.content = `${this.content}${data[0].text}\n`;
      } else {
        //item.done === -1/1
        this.content = `${this.content}${data.message}\n`;
        // stop subscribe
        this._stopSubscribe();
      }
    }
  },
};

</script>
<style>
</style>
