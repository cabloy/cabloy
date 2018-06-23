<template>
  <f7-page>
    <eb-navbar :title="$text('Sign up')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" auto :data="data" :params="{validator: 'signup'}" :onPerform="onPerformValidate">
      </eb-validate>
      <eb-button :onPerform="signUp">{{$text('Sign up')}}</eb-button>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      data: {
        userName: null,
        realName: null,
        email: null,
        mobile: null,
        password: null,
        passwordAgain: null,
      }
    }
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/signup', {
        data: this.data
      }).then(() => {
        return this.$api.post('passport/a-authsimple/authsimple', {
          auth: this.data.email || this.data.mobile,
          password: this.data.password,
          rememberMe: false,
        }).then(user => {
          this.$store.commit('auth/login', {
            loggedIn: true,
            user,
          });
          this.$meta.vueApp.reload();
        });
      });
    },
    signUp() {
      return this.$refs.validate.perform();
    },
  },
};

</script>
<style scoped>
.text-smaller {
  font-size: smaller !important;
}

</style>
