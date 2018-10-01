<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate">
          <f7-list form no-hairlines-md>
            <f7-list-item>
              <f7-icon material="person_outline" slot="media"></f7-icon>
              <f7-label floating>{{$text('Your username/mobile/email')}}</f7-label>
              <eb-input type="text" :placeholder="$text('Your username/mobile/email')" clear-button v-model="auth" dataPath="auth"></eb-input>
            </f7-list-item>
            <f7-list-item>
              <f7-icon material="lock_outline" slot="media"></f7-icon>
              <f7-label floating>{{$text('Your password')}}</f7-label>
              <eb-input type="password" :placeholder="$text('Your password')" clear-button v-model="password" dataPath="password"></eb-input>
            </f7-list-item>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <span class="text-color-gray">{{$text('Remember me')}}</span>
              <eb-toggle v-model="rememberMe" dataPath="rememberMe"></eb-toggle>
            </f7-list-item>
          </f7-list>
        </eb-validate>
        <f7-list>
          <eb-list-button :onPerform="signIn">{{$text('Sign in')}}</eb-list-button>
        </f7-list>
      </f7-card-content>
      <f7-card-footer>
        <div></div>
        <!-- <eb-link class="text-smaller">{{$text('Find password')}}</eb-link> -->
        <eb-link eb-href="/a/authsimple/signup" eb-target="_self" class="text-smaller">{{$text('Sign up')}}</eb-link>
      </f7-card-footer>
    </f7-card>
    <f7-card v-if="$config.test">
      <f7-card-header>{{$text('Test Account')}}</f7-card-header>
      <f7-card-content>demo@cabloy.org : 123456</f7-card-content>
    </f7-card>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      auth: null,
      password: null,
      rememberMe: false,
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('passport/a-authsimple/authsimple', {
        auth: this.auth,
        password: this.password,
        rememberMe: this.rememberMe,
      }).then(() => {
        this.$meta.vueApp.reload({ echo: true });
      });
    },
    signIn() {
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
