<template>
  <eb-page>
    <eb-navbar :title="$text('Mine')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!inAgent" iconMaterial="settings" eb-href="user/mineAgent"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <div class="mine">
      <div class="mine-block">
        <img class="avatar avatar48" :src="userAvatar" style="cursor:pointer;" @click="onClickAvatar">
      </div>
      <div class="mine-block name">{{userName}}</div>
      <div class="mine-block status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
      <f7-segmented strong tag="div" class="login">
        <eb-button v-if="inAgent" :onPerform="onPerformSwitchOff">{{$text('Quit Agent')}}</eb-button>
        <eb-link v-if="!loggedIn" :onPerform="onPerformLogin">{{$text('Sign In')}}</eb-link>
        <eb-button v-if="loggedIn" :onPerform="onPerformLogout">{{$text('Log Out')}}</eb-button>
      </f7-segmented>
    </div>
    <f7-list>
      <eb-list-item v-if="!user.agent.anonymous" :title="$text('Account')" link="#" eb-href="user/account" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Functions')" link="#" eb-href="user/functions" eb-target="_self"></eb-list-item>
      <f7-list-item divider></f7-list-item>
      <eb-list-item v-if="viewEnable" :title="$text('ViewLayout')" link="#" eb-href="view" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Theme')" link="#" eb-href="theme" eb-target="_self"></eb-list-item>
      <eb-list-item v-if="!user.agent.anonymous" :title="$text('Settings')" link="#" eb-href="/a/settings/user/list" eb-target="_self"></eb-list-item>
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
    inAgent() {
      return this.user.op.id !== this.user.agent.id;
    },
    userName() {
      let userName = this.user.op.userName;
      if (this.inAgent) {
        userName = `${userName}(${this.$text('Agent')})`;
      }
      return userName;
    },
    userAvatar() {
      let avatar = this.user.op.avatar;
      if (!avatar) {
        const configBase = this.$meta.config.modules['a-base'];
        avatar = configBase.user.avatar.default;
      }
      return this.$meta.util.combineImageUrl(avatar, 48);
    },
    viewEnable() {
      return this.$meta.vueApp.layout === 'pc' && this.$meta.vueLayout.closePanel;
    },
  },
  created() {},
  methods: {
    onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    onPerformLogout() {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('/a/base/auth/logout').then(() => {
          this.$meta.vueApp.reload({ echo: true });
        });
      });
    },
    async onPerformSwitchOff() {
      await this.$view.dialog.confirm();
      await this.$api.post('user/switchOffAgent');
      this.$meta.vueApp.reload({ echo: true });
    },
    onClickAvatar() {
      if (this.user.agent.anonymous || this.inAgent) return;
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
                const userNew = Object.assign({}, this.$store.state.auth.user.agent, { avatar: res.downloadUrl });
                this.$store.commit('auth/setUser', { op: userNew, agent: userNew });
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
.mine {
  position: relative;
  display: flex;
  align-items: center;
  height: 100px;
  background-color: var(--f7-text-editor-toolbar-bg-color);
  color: var(--f7-block-header-text-color);
  padding-left: 24px;

  .mine-block {
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
    .button{
      width: auto;
    }
  }
}

</style>
