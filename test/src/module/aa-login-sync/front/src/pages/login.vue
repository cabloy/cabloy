<template>
  <div>
    <h1>Login</h1>
    <input type="text" v-model="username">
    <input type="password" v-model="password">
    <button @click="login">Sign in</button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      username: 'zhennann',
      password: '123456',
    };
  },
  methods: {
    login() {
      this.$store.commit('auth/login', { user: { name: this.username } });
      this.$router.replace({ path: this.$route.query.redirect });
    },
  },
};

</script>
<style>


</style>
