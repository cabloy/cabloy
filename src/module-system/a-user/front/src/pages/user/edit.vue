<template>
  <eb-page>
    <eb-navbar :title="$text('Info')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" auto :data="user" :params="{module:'a-base',validator: 'user'}" :onPerform="onPerformValidate">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  components: {},
  data() {
    return {
      user: Vue.prototype.$utils.extend({}, this.$store.state.auth.user.agent),
    };
  },
  methods: {
    onPerformLogin() {
      this.$meta.vueLayout.openLogin();
    },
    onPerformLogout() {
      return this.$api.post('/a/base/auth/logout').then(user => {
        this.$store.commit('auth/login', {
          loggedIn: false,
          user,
        });
        this.$meta.vueApp.reload();
      });
    },
    onPerformSave(event) {
      return this.$refs.validate.perform(event);
    },
    onPerformValidate(event) {
      return this.$api.post('user/save', {
        data: this.user,
      }).then(() => {
        this.$store.state.auth.user.agent = this.user;
        this.$f7router.back();
      });
    },
  },
};

</script>
<style lang="less" scoped>


</style>
