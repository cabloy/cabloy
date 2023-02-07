<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Mine')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Info')" link="#" eb-href="user/edit" eb-target="_self"></eb-list-item>
      <eb-list-item
        v-if="configAccount.url.passwordChange"
        link="#"
        :title="$text('Change Password')"
        :eb-href="configAccount.url.passwordChange"
        eb-target="_self"
      ></eb-list-item>
      <f7-list-item divider></f7-list-item>
      <eb-list-item :title="$text('Appearance')" link="#" eb-href="user/appearance" eb-target="_self"></eb-list-item>
      <eb-list-item
        :title="$text('Settings')"
        link="#"
        eb-href="/a/settings/user/list"
        eb-target="_self"
      ></eb-list-item>
      <template v-if="!$config.agent.disabled">
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Agent')" link="#" eb-href="user/agent" eb-target="_self"></eb-list-item>
      </template>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      configAccount: null,
    };
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
    userAvatar() {
      return this.$meta.util.combineAvatarUrl(this.user.op.avatar, 48);
    },
    viewEnable() {
      return this.$meta.vueApp.layout === 'pc' && this.$meta.vueLayout.closePanel;
    },
  },
  created() {
    const configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {
    onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    async onPerformLogout() {
      await this.$view.dialog.confirm();
      await this.$meta.vueApp.logout();
    },
    onClickAvatar() {
      if (this.user.agent.anonymous || this.user.op.id !== this.user.agent.id) return;
      this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 1,
          },
          callback: (code, res) => {
            if (code === 200) {
              return this.$api
                .post('user/saveAvatar', {
                  data: { avatar: res.downloadUrl },
                })
                .then(() => {
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
.me {
  position: relative;
  display: flex;
  align-items: center;
  height: 100px;
  background-color: var(--f7-text-editor-toolbar-bg-color);
  color: var(--f7-block-header-text-color);
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
