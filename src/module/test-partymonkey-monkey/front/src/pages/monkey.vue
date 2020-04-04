<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Monkey Test')" eb-back-link="Back"> </eb-navbar>
    <f7-block strong>
      <div class="alert-info">{{$text('MonkeyerTestTip1')}}</div>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$module);
  },
};

</script>
<style scoped>
</style>
