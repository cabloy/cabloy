<template>
  <eb-page>
    <eb-navbar :title="$text('About')" eb-back-link="Back"> </eb-navbar>
    <f7-block-title>{{$text('Welcome to Framework7')}}</f7-block-title>
    <f7-block strong>
      <p>{{$text('F7AboutTip1')}}</p>
      <p>{{$text('F7AboutTip2')}}</p>
      <p>{{$text('F7AboutTip3')}}</p>
      <div class="alert-info">{{$text('F7AboutTip4')}}</div>
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
