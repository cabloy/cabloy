<template>
  <eb-page>
    <eb-navbar :title="$text('About')" eb-back-link="Back"> </eb-navbar>
    <f7-block-title>{{$text('Welcome to CabloyJS')}}</f7-block-title>
    <f7-block strong>
      <p>{{$text('AboutTip1')}}</p>
      <p>{{$text('AboutTip2')}}</p>
      <p>{{$text('AboutTip3')}}</p>
      <p>{{$text('AboutTip4')}}</p>
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
