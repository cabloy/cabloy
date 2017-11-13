<template>
  <f7-page>
    <f7-navbar title="Profile" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <div>
        <div>LoggedIn as {{this.$store.state.auth.user.name}}!</div>
        <button @click="logout">Sign out</button>
      </div>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$meta.eventHub.$emit(this.$meta.constant.event.logout);
    },
  },
};

</script>
<style>


</style>
