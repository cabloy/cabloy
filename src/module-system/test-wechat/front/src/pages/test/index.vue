<template>
  <eb-page>
    <eb-navbar :title="$text('Test')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item :title="微信扫一扫" :onPerform="onPerformScanQRCode"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {

    };
  },
  created() {},
  methods: {
    onPerformScanQRCode() {
      console.log('0000');
    }
  }
};

</script>
