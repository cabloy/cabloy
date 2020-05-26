<template>
  <eb-page>
    <eb-navbar large largeTransparent title="Socket IO" eb-back-link="Back"></eb-navbar>
    <f7-messagebar ref="messagebar" placeholder="Message" @submit="onSubmit">
      <f7-icon md="material:send" slot="send-link"></f7-icon>
    </f7-messagebar>
    <f7-messages ref="messages">
      <f7-messages-title>{{new Date()}}</f7-messages-title>
      <f7-message v-for="(item,index) in messagesData" :key="index" :type="item.message.type" :name="item.author.name" :avatar="item.author.avatar" :first="isFirstMessage(item, index)" :last="isLastMessage(item, index)" :tail="isTailMessage(item, index)">
        <span slot="text" v-if="item.message.content.text" v-text="`${item.message.id || ''}:${item.message.content.text}`"></span>
      </f7-message>
    </f7-messages>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      io: null,
      messagesData: [],
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
    userAvatar() {
      let avatar = this.user.avatar;
      if (!avatar) {
        const configBase = this.$meta.config.modules['a-base'];
        avatar = configBase.user.avatar.default;
      }
      return this.$meta.util.combineImageUrl(avatar, 48);
    },
    author() {
      return {
        name: this.user.userName,
        avatar: this.userAvatar,
      };
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
      this.io.subscribe(
        '/a/base/sss',
        this.onMessage.bind(this),
        this.onSubscribed.bind(this), { scene: true },
      );
    });
  },
  mounted() {
    this.messagebar = this.$refs.messagebar.f7Messagebar;
    this.messages = this.$refs.messages.f7Messages;
  },
  methods: {
    onMessage() {},
    onSubscribed() {},
    isFirstMessage(item, index) {
      const previousItem = this.messagesData[index - 1];
      if (item.message.isTitle) return false;
      if (!previousItem || previousItem.message.type !== item.message.type || previousItem.message.name !== item.message.name) return true;
      return false;
    },
    isLastMessage(item, index) {
      const nextItem = this.messagesData[index + 1];
      if (item.message.isTitle) return false;
      if (!nextItem || nextItem.message.type !== item.message.type || nextItem.message.name !== item.message.name) return true;
      return false;
    },
    isTailMessage(item, index) {
      return this.isLastMessage(item, index);
    },
    onSubmit(value, clear) {
      // message
      const message = {
        id: null,
        messageType: 1, // text
        content: {
          text: value,
        }
      };
      this.messagesData.push({
        message,
        author: this.author,
      });
      // clear
      clear();
      // focus
      if (value) {
        this.messagebar.focus();
      }
      // send
      this.$api.post('/a/socketio/publish', {
        path: '/test/party/test',
        message,
        messageClass: {
          module: 'test-party',
          messageClassName: 'test',
        },
        options: {
          scene: null,
        },
      }).then(data => {
        message.id = data.id;
      });

    }
  }
}

</script>
