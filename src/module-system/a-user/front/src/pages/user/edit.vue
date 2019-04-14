<template>
  <eb-page>
    <eb-navbar :title="$text('Info')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :auto="false" :data="user" :params="{module:'a-base',validator: 'user'}" :onPerform="onPerformValidate">
      <f7-list form no-hairlines-md>
        <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
        <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Email')">
          <div slot="after">
            <span>email</span>
            <template v-if="configAccount.url.emailConfirm && user.emailConfirmed">
              <eb-link>修改</eb-link>
            </template>
            <template v-if="configAccount.url.emailConfirm && !user.emailConfirmed">
              <eb-link>确认</eb-link>
            </template>
          </div>
        </eb-list-item>
        <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
        <f7-list-item divider></f7-list-item>
        <eb-list-item-validate dataKey="motto"></eb-list-item-validate>
        <eb-list-item-validate dataKey="locale"></eb-list-item-validate>
      </f7-list>
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
      configAccount: null,
    };
  },
  created() {
    const configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {
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
