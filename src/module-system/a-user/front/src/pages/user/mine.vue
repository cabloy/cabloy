<template>
  <eb-page>
    <eb-navbar :title="$text('Mine')" eb-back-link="Back">
    </eb-navbar>
    <div class="me">
      <div>
        <img class="avatar avatar48" :src="$meta.util.combineImageUrl(user.op.avatar,48)" style="cursor:pointer;" @click="onClickAvatar">
      </div>
      <div class="name">{{userName}}</div>
      <div class="status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
      <div class="login">
        <eb-link v-if="!loggedIn" :onPerform="onPerformLogin">{{$text('Sign In')}}</eb-link>
        <eb-link v-if="loggedIn" :onPerform="onPerformLogout">{{$text('Log Out')}}</eb-link>
      </div>
    </div>
    <f7-list>
      <eb-list-item v-if="!user.agent.anonymous" :title="$text('Account')" eb-href="user/account"></eb-list-item>
      <eb-list-item :title="$text('Functions')" eb-href="user/functions"></eb-list-item>
      <eb-list-item :title="$text('Settings')" eb-href="/a/settings/user/list"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
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
      this.$view.dialog.confirm().then(() => {
        return this.$api.post('/a/base/auth/logout').then(() => {
          this.$meta.vueApp.reload({ echo: true });
        });
      });
    },
    onClickAvatar() {
      if (this.user.agent.anonymous || this.user.op.id !== this.user.agent.id);
      this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 1,
          },
          callback: (code, res) => {
            if (code === 200) {
              return this.$api.post('user/saveAvatar', {
                data: { avatar: res.downloadUrl },
              }).then(() => {
                this.$store.state.auth.user.agent.avatar = res.downloadUrl;
                this.$store.state.auth.user.op.avatar = res.downloadUrl;
              });
            }
          },
        },
      });

    },
  },
};

</script>
<style lang="less" scoped>
.me {
  position: relative;
  display: flex;
  align-items: center;
  height: 100px;
  background-color: #F4F4F4;
  color: dimgray;
  padding-left: 24px;

  div {
    display: flex;
    align-items: center;
    padding-right: 12px;
  }

  .name {
    font-size: 20px;
  }

  .status {
    font-size: 16px;
  }

  .login {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
}

</style>
