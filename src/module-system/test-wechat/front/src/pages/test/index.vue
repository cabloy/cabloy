<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Test')" eb-back-link="Back"></eb-navbar>
    <eb-list v-if="wx" no-hairlines-md>
      <eb-list-item title="微信扫一扫" link="#" :onPerform="onPerformScanQRCode"></eb-list-item>
      <eb-list-item title="获取openid" link="#" :onPerform="onPerformOpenid"></eb-list-item>
      <eb-list-item title="openid">
        <div slot="after">{{openid}}</div>
      </eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      moduleWechat: null,
      wx: null,
      openid: null,
    };
  },
  created() {
    const action = {
      actionModule: 'a-wechat',
      actionComponent: 'jssdk',
      name: 'config',
    };
    this.$meta.util.performAction({ ctx: this, action }).then(res => {
      this.wx = res && res.wx;
    }).catch(e => {
      this.$view.toast.show({ text: e.message });
    })
  },
  methods: {
    onPerformScanQRCode() {
      this.wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: (res) => {
          this.$view.toast.show({ text: res.resultStr });
        }
      });
    },
    onPerformOpenid() {
      return this.$api.post('test/getOpenid').then(data => {
        this.openid = data.openid;
      })
    }
  }
};

</script>
