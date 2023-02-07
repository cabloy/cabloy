export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    userOp() {
      return this.layoutManager.base_user;
    },
    userAgent() {
      return this.layoutManager.base_userAgent;
    },
    inAgent() {
      return this.layoutManager.base_inAgent;
    },
    loggedIn() {
      return this.layoutManager.base_loggedIn;
    },
    userName() {
      let userName = this.userOp.userName;
      if (this.inAgent) {
        userName = `${userName}(${this.$text('Agent')})`;
      }
      return userName;
    },
    userAvatar() {
      return this.$meta.util.combineAvatarUrl(this.userOp.avatar, 48);
    },
  },
  methods: {
    onClickAvatar() {
      if (this.userAgent.anonymous || this.inAgent) return;
      this.$view.navigate('/a/file/file/upload', {
        target: this.$meta.vueApp.layout === 'pc' ? '_self' : '',
        context: {
          params: {
            mode: 1,
            fixed: {
              width: 200,
              height: 200,
            },
          },
          callback: (code, res) => {
            if (code === 200) {
              return this.$api
                .post('/a/user/user/saveAvatar', {
                  data: { avatar: res.downloadUrl },
                })
                .then(() => {
                  const userNew = Object.assign({}, this.userAgent, { avatar: res.downloadUrl });
                  this.$store.commit('auth/setUser', { op: userNew, agent: userNew });
                });
            }
          },
        },
      });
    },
    onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    async onPerformLogout() {
      await this.$view.dialog.confirm();
      await this.$meta.vueApp.logout();
    },
    async onPerformSwitchOff() {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/user/user/switchOffAgent');
      this.$meta.vueApp.reload({ echo: true });
    },
  },
  render() {
    return (
      <div class="mine-user">
        <div class="mine-block">
          <img class="avatar avatar48" src={this.userAvatar} style="cursor:pointer;" onClick={this.onClickAvatar} />
        </div>
        {this.loggedIn && <div class="mine-block name">{this.userName}</div>}
        {!this.loggedIn && <div class="mine-block status">{this.$text('Not LoggedIn')}</div>}
        <f7-segmented strong tag="div" class="login">
          {this.inAgent && <eb-button propsOnPerform={this.onPerformSwitchOff}>{this.$text('Quit Agent')}</eb-button>}
          {!this.loggedIn && <eb-button propsOnPerform={this.onPerformLogin}>{this.$text('Sign In')}</eb-button>}
          {this.loggedIn && <eb-button propsOnPerform={this.onPerformLogout}>{this.$text('Log Out')}</eb-button>}
        </f7-segmented>
      </div>
    );
  },
};
