<template>
  <eb-page>
    <eb-navbar :title="$text('State Management')" eb-back-link="Back"></eb-navbar>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    testModuleCurrent() {
      // state
      const message = this.$local.state.message;
      // getters
      const message2 = this.$local.getters('message2');
      // mutations
      this.$local.commit('setMessage', 'test for commit');
      // actions
      this.$local.dispatch('getMessage').then(data => {
        console.log(data);
      });
    },
    testModuleOther() {
      this.$meta.module.use('test-party', module => {
        // state
        const message = this.$store.getState('test/party/message');
        // getters
        const message2 = this.$store.getters['test/party/message2'];
        // mutations
        this.$store.commit('test/party/setMessage', 'test for commit');
        // actions
        this.$store.dispatch('test/party/getMessage').then(data => {
          console.log(data);
        });
      });
    },
  },
};

</script>
<style scoped>
</style>
