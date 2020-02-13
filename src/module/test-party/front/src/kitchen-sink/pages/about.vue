<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('About')" eb-back-link="Back"> </eb-navbar>
    <f7-block-title>{{$text('Welcome to CabloyJS')}}</f7-block-title>
    <f7-block strong>
      <div class="alert-info">{{$text('CabloyAboutTip1')}}</div>
      <p>{{$text('CabloyAboutTip2')}}</p>
      <p>{{$text('CabloyAboutTip3')}}</p>
      <p>{{$text('CabloyAboutTip4')}}</p>
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
