<template>
  <div>
    <eb-link :popover-open="`#${popoverId}`">
      <div>
        <img class="avatar avatar24" :src="user.op.avatar">
      </div>
      <div class="name" v-if="loggedIn">{{userName}}</div>
      <div class="status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
    </eb-link>
    <f7-popover :id="popoverId">
      <f7-list inset>
        <eb-list-item popover-close :title="$text('Mine')" :eb-href="$config.layout.header.mine.url">
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
  },
  methods: {
    onSignin() {
      this.$meta.vueLayout.openLogin();
    },
    onLogout() {
      return this.$api.post('/a/base/auth/logout').then(user => {
        this.$store.commit('auth/login', {
          loggedIn: false,
          user,
        });
        this.$meta.vueApp.reload();
      });
    },
  },
};

</script>
<style scoped>


</style>
