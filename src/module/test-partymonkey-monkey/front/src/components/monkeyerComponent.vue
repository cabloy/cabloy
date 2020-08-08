<template>
  <f7-block strong>
    <div class="alert-info">{{$text('MonkeyerTestTip2')}}</div>
  </f7-block>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    // monkey component
    console.log('monkey-component module:', this.$module.name);
  },
};

</script>
<style scoped>
</style>
