<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Test')" eb-back-link="Back"></eb-navbar>
    <f7-messagebar ref="messagebar" class="test-messagebar" placeholder="Message" @submit="onSubmitSendMessage">
      <f7-icon md="material:send" slot="send-link"></f7-icon>
    </f7-messagebar>
    <eb-list v-if="dd" no-hairlines-md>
      <eb-list-item title="钉钉扫一扫" link="#" :onPerform="onPerformScanQRCode"></eb-list-item>
      <eb-list-item title="获取MemberId" link="#" :onPerform="onPerformMemberId"></eb-list-item>
      <eb-list-item title="MemberId">
        <div slot="after">{{memberId}}</div>
      </eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      dd: null,
      memberId: null,
    };
  },
  created() {
    const action = {
      actionModule: 'a-dingtalk',
      actionComponent: 'jssdk',
      name: 'config',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(res => {
      this.dd = res && res.dd;
    }).catch(e => {
      this.$view.toast.show({ text: e.message });
    });
  },
  mounted() {
    this.messagebar = this.$refs.messagebar.f7Messagebar;
  },
  methods: {
    onPerformScanQRCode() {
      this.dd.biz.util.scan({
        type: 'all',
        onSuccess: res => {
          this.$view.toast.show({ text: res.text });
        },
        onFail: err => {
          this.$view.toast.show({ text: err.message });
        },
      });
    },
    onPerformMemberId() {
      return this.$api.post('test/getMemberId').then(data => {
        this.memberId = data.memberId;
      });
    },
    onSubmitSendMessage(value, clear) {
      // clear
      clear();
      // focus
      if (value) {
        this.messagebar.focus();
      }
      // send
      this.$api.post('test/sendAppMessage', {
        message: {
          text: value,
        },
      }).then(() => {
        // donothing
      });
    },
  },
};

</script>
<style scoped>
.test-messagebar {
  margin-bottom: 56px;
}

</style>
