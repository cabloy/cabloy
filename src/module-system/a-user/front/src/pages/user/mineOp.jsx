export default {
  components: {},
  data() {
    return {
      resourceType: 'a-base:mine',
      treeData: null,
      resourcesArrayAll: null,
    };
  },
  computed: {
    ready() {
      return this.treeData && this.resourcesArrayAll;
    },
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
      return this.$meta.util.combineAvatarUrl(this.user.op.avatar, 48);
    },
    viewEnable() {
      return this.$meta.vueApp.layout === 'pc' && this.$meta.vueLayout.closePanel;
    },
  },
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', {
        resourceType: this.resourceType,
      });
      this.treeData = await this.$store.dispatch('a/base/getCategoryTreeResourceMenu', {
        resourceType: this.resourceType,
        appKey: 'a-app:appDefault',
      });
    },
    __getMineItemsOfCategory(category) {
      return this.resourcesArrayAll.filter(item => item.atomCategoryId === category.id);
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
      await this.$api.post('user/switchOffAgent');
      this.$meta.vueApp.reload({ echo: true });
    },
    onPerformMineItem(event, mineItem) {
      const resourceConfig = JSON.parse(mineItem.resourceConfig);
      const action = this.$utils.extend({}, resourceConfig, {
        targetEl: event.currentTarget,
        navigateOptions: { target: '_self' },
      });
      return this.$meta.util.performAction({ ctx: this, action, item: null });
    },
    onClickAvatar() {
      if (this.user.agent.anonymous || this.inAgent) return;
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
    renderStats(mineItem) {
      const resourceConfig = JSON.parse(mineItem.resourceConfig);
      const stats = resourceConfig.stats;
      if (!stats) return;
      if (stats.color === 'auto') {
        return <eb-stats-color stats_params={stats.params}></eb-stats-color>;
      }
      return <eb-stats stats_params={stats.params} stats_color={stats.color}></eb-stats>;
    },
    renderMineItems(category) {
      const children = [];
      const mineItems = this.__getMineItemsOfCategory(category);
      for (const mineItem of mineItems) {
        children.push(
          <eb-list-item
            key={mineItem.atomStaticKey}
            link="#"
            title={mineItem.atomNameLocale}
            propsOnPerform={event => this.onPerformMineItem(event, mineItem)}
          >
            <div slot="after">{this.renderStats(mineItem)}</div>
          </eb-list-item>
        );
      }
      return children;
    },
    renderList() {
      if (!this.ready) return;
      const children = [];
      for (const category of this.treeData) {
        children.push(
          <f7-list-group key={category.id}>
            <f7-list-item group-title title={category.categoryNameLocale}></f7-list-item>
            {this.renderMineItems(category)}
          </f7-list-group>
        );
      }
      return <f7-list>{children}</f7-list>;
    },
    renderTitleButtons() {
      if (this.user.agent.anonymous) return;
      const children = [];
      // message
      children.push(
        <eb-link-color
          key="messages"
          iconF7="::message"
          eb-href="/a/message/group"
          eb-target="_self"
          stats_params={{ module: 'a-message', name: 'message' }}
        ></eb-link-color>
      );
      // settings
      if (!this.inAgent) {
        children.push(
          <eb-link key="settings" iconF7="::settings" eb-href="user/mineAgent" eb-target="_self"></eb-link>
        );
      }
      return children;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.$text('Mine')} eb-back-link="Back">
          <f7-nav-right>{this.renderTitleButtons()}</f7-nav-right>
        </eb-navbar>
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
        {this.renderList()}
      </eb-page>
    );
  },
};
