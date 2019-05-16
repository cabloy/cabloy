<template>
  <div>
    <f7-link :popover-open="`#${popoverId}`">
      <div class="item" v-if="loggedIn">
        <img class="avatar avatar24" :src="userAvatar">
      </div>
      <div class="item name" v-if="loggedIn">{{userName}}</div>
      <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
    </f7-link>
    <f7-popover :id="popoverId">
      <f7-list inset>
        <eb-list-item popover-close :title="$text('Mine')" link="#" :eb-href="$config.layout.header.mine.url">
          <f7-icon slot="media" :material="$config.layout.header.mine.iconMaterial"></f7-icon>
        </eb-list-item>
        <eb-list-item v-if="!loggedIn" popover-close link="#" :onPerform="onSignin">{{$text('Sign in')}}</eb-list-item>
        <eb-list-item v-if="loggedIn" popover-close link="#" :onPerform="onLogout">{{$text('Log Out')}}</eb-list-item>
      </f7-list>
    </f7-popover>
  </div>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
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
      let avatar = this.user.op.avatar;
      if (!avatar) {
        const configBase = this.$meta.config.modules['a-base'];
        avatar = configBase.user.avatar.default;
      }
      return this.$meta.util.combineImageUrl(avatar, 48);
    },
  },
  methods: {
    onSignin() {
      this.$meta.vueLayout.openLogin();
    },
    onLogout() {
      this.$f7.dialog.confirm(this.$text('Are you sure to perform this operation?'), () => {
        this.$api.post('/a/base/auth/logout').then(() => {
          this.$meta.vueApp.reload({ echo: true });
        });
      });
    },
  },
};

</script>
<style scoped>
</style>
