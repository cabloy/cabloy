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
    // monkey route
    console.log('monkey-route module:', this.$module.name);
    // monkey store: getters
    const message2 = this.$store.getters['test/party/message2'];
    console.log('monkey-store message2:', message2);
    // monkey store: mutations
    const messageOld = this.$store.getState('test/party/message');
    this.$store.commit('test/party/setMessage', 'test for monkey');
    const messageNew = this.$store.getState('test/party/message');
    console.log('monkey-store setMessage:', messageNew);
    this.$store.commit('test/party/setMessage', messageOld);

  },
};

</script>
<style scoped>
</style>
