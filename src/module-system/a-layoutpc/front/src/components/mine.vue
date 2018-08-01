<template>
  <div>
    <div>
      <img class="avatar avatar24" :src="user.op.avatar">
    </div>
    <div class="name">{{userName}}</div>
    <div class="status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
  </div>
</template>
<script>
export default {
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    user() {
      return this.$store.state.auth.user;
    },
    userName() {
      let userName = this.user.op.userName;
      if (this.user.op.id !== this.user.agent.id) {
        userName = `${userName}(${this.$text('Agent')})`;
      }
      return userName;
    },
  },
};

</script>
<style scoped>


</style>
