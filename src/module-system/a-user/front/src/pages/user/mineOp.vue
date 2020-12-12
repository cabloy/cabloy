<template>
  <eb-page>
    <eb-navbar :title="$text('Mine')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!user.agent.anonymous && !inAgent" iconMaterial="settings" eb-href="user/mineAgent" eb-target="_self"></eb-link>
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
    <f7-list v-if="ready">
      <f7-list-group v-for="category of treeData" :key="category.id">
        <f7-list-item group-title :title="category.categoryNameLocale"></f7-list-item>
        <eb-list-item v-for="mineItem of __getMineItemsOfCategory(category)" :key="mineItem.atomStaticKey"
         link="#" :title="mineItem.atomNameLocale"
         :context="mineItem" :onPerform="onPerformMineItem">
          <div slot="after">
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>

  </eb-page>
</template>
<script>
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
  created() {
    this.__init();
  },
  methods: {
    async __init() {
      this.resourcesArrayAll = await this.$store.dispatch('a/base/getResourcesArray', { resourceType: this.resourceType });
      this.treeData = await this.$store.dispatch('a/base/getResourceTrees', { resourceType: this.resourceType });
    },
    __getMineItemsOfCategory(category) {
      return this.resourcesArrayAll.filter(item => item.atomCategoryId === category.id);
    },
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
    onPerformMineItem(event, mineItem) {
      const resourceConfig = JSON.parse(mineItem.resourceConfig);
      const action = this.$utils.extend({}, resourceConfig, {
        targetEl: event.target,
        navigateOptions: { target: '_self' },
      });
      return this.$meta.util.performAction({ ctx: this, action, item: null });
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
