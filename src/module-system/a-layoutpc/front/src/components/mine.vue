<template>
  <div>
    <f7-link @click="onClickMine">
      <div class="item" v-if="loggedIn">
        <img class="avatar avatar24" :src="userAvatar">
      </div>
      <div class="item name" v-if="loggedIn">{{userName}}</div>
      <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
    </f7-link>
  </div>
</template>
<script>
import Vue from 'vue';
export default {
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
    onClickMine() {
      const mineConfig = this.$config.layout.header.mine;
      this.$meta.vueLayout.navigate(mineConfig.url, { scene: mineConfig.scene, sceneOptions: mineConfig.sceneOptions });
    },
    onSignin() {
      this.$meta.vueLayout.openLogin();
    },
    onLogout() {
      this.$f7.dialog.confirm(this.$text('Are you sure to perform this operation?'), () => {
        this.$api.post('/a/base/auth/logout').then(() => {
          this.$meta.vueApp.reload({ echo: true });
        }).catch(err => {
          const notification = this.$f7.notification.create({
            icon: '<i class="material-icons">error</i>',
            title: err.message,
            closeTimeout: 3000,
          });
          notification.open();
        });
      });
    },
    onTheme() {
      this.$meta.vueLayout.navigate('/a/user/theme');
    }
  },
};

</script>
<style scoped>
</style>
