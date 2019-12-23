<template>
  <eb-page>
    <eb-navbar :title="$text('Test')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item title="微信扫一扫" link="#" :onPerform="onPerformScanQRCode"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      moduleWechat: null,
    };
  },
  created() {
    const action = {
      actionModule: 'a-wechat',
      actionComponent: 'jssdk',
      name: 'config',
    };
    const item = { flag: 'test' };
    this.$meta.util.performAction({ ctx: this, action, item }).then(res => {
      console.log(res);
    });
  },
  methods: {
    onPerformScanQRCode() {
      console.log('0000');
    }
  }
};

</script>
