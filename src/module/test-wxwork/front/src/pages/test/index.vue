<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Test')" eb-back-link="Back"></eb-navbar>
    <f7-messagebar ref="messagebar" class="test-messagebar" placeholder="Message" @submit="onSubmitSendMessage">
      <f7-icon md="material:send" slot="send-link"></f7-icon>
    </f7-messagebar>
    <eb-list v-if="wx" no-hairlines-md>
      <eb-list-item title="微信扫一扫" link="#" :onPerform="onPerformScanQRCode"></eb-list-item>
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
      wx: null,
      memberId: null,
    };
  },
  created() {
    const action = {
      actionModule: 'a-wxwork',
      actionComponent: 'jssdk',
      name: 'config',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(res => {
      this.wx = res && res.wx;
    }).catch(e => {
      this.$view.toast.show({ text: e.message });
    })
  },
  mounted() {
    this.messagebar = this.$refs.messagebar.f7Messagebar;
  },
  methods: {
    onPerformScanQRCode() {
      this.wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: res => {
          this.$view.toast.show({ text: res.resultStr });
        },
        fail: res => {
          this.$view.toast.show({ text: res.errMsg });
        }
      });
    },
    onPerformMemberId() {
      return this.$api.post('test/getMemberId').then(data => {
        this.memberId = data.memberId;
      })
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
    }

  }
};

</script>
<style scoped>
.test-messagebar {
  margin-bottom: 56px;
}

</style>
