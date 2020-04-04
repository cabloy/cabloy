<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Monkey Test')" eb-back-link="Back"> </eb-navbar>
    <f7-block strong>
      <div class="alert-info">{{$text('MonkeyeeTestTip1')}}</div>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
};

</script>
<style scoped>
</style>
