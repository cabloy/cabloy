<template>
  <f7-page>
    <eb-navbar :title="$text('Mine')" eb-back-link="Back">
    </eb-navbar>
    <f7-block>
      <div class="me">
        <div>
          <img class="avatar avatar48" :src="user.op.avatar">
        </div>
        <div class="name">{{userName}}</div>
        <div class="status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
        <div class="login">
          <eb-button v-if="!loggedIn" :onPerform="onPerformLogin" fill big color="orange">{{$text('Sign In')}}</eb-button>
          <eb-button v-if="loggedIn" :onPerform="onPerformLogout" fill big color="orange">{{$text('Log Out')}}</eb-button>
        </div>
      </div>
    </f7-block>
    <f7-list>
      <eb-list-item :title="$text('Info')" eb-href="user/edit"></eb-list-item>
      <eb-list-item v-if="!$config.agent.disabled" :title="$text('Agent')" eb-href="user/agent"></eb-list-item>
      <eb-list-item :title="$text('Functions')" eb-href="user/functions"></eb-list-item>
      <eb-list-item :title="$text('Settings')" eb-href="/a/settings/user/list"></eb-list-item>
    </f7-list>
  </f7-page>
</template>
<script>
import Vue from 'vue';
export default {
  components: {},
  data() {
    return {};
  },
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
  created() {},
  methods: {
    onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    onPerformLogout() {
      return this.$api.post('/a/base/auth/logout').then(user => {
        this.$store.commit('auth/login', {
          loggedIn: false,
          user,
        });
        this.$meta.vueApp.reload();
      });
    },
  }
};

</script>
<style lang="less" scoped>
.me {
  border-radius: 6px;
  border-radius: 6px;
  background-color: #b58900;
  text-align: center;
  opacity: 0.8;
  width: 90%;
  position: relative;
  left: 0;
  right: 0;
  margin: auto;

  img {
    margin-top: 20px;
  }

  .name {
    font-size: 20px;
    color: dimgray;
  }

  .status {
    font-size: 16px;
    color: dimgray;
  }
}

</style>
