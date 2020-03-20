<template>
  <eb-link class="mine" :onPerform="onPerform">
    <div class="item" v-if="loggedIn">
      <img class="avatar avatar24" :src="userAvatar">
    </div>
    <div class="item name" v-if="loggedIn">{{userName}}</div>
    <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
  </eb-link>
</template>
<script>
// export
export default {
  install,
};

// install
function install(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
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
      userAvatar() {
        let avatar = this.user.op.avatar;
        if (!avatar) {
          const configBase = this.$meta.config.modules['a-base'];
          avatar = configBase.user.avatar.default;
        }
        return this.$meta.util.combineImageUrl(avatar, 48);
      },
    },
    methods: {
      onPerform() {
        const button = this.$config.layout.header.button.mine;
        if (button) {
          this.$meta.vueLayout.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
        }
      },
      // onSignin() {
      //   this.$meta.vueLayout.openLogin();
      // },
      // onLogout() {
      //   this.$f7.dialog.confirm(this.$text('Are you sure to perform this operation?'), () => {
      //     this.$api.post('/a/base/auth/logout').then(() => {
      //       this.$meta.vueApp.reload({ echo: true });
      //     }).catch(err => {
      //       const notification = this.$f7.notification.create({
      //         icon: '<i class="material-icons">error</i>',
      //         title: err.message,
      //         closeTimeout: 3000,
      //       });
      //       notification.open();
      //     });
      //   });
      // },
      // onTheme() {
      //   this.$meta.vueLayout.navigate('/a/user/theme');
      // }
    },
  };
}

</script>
