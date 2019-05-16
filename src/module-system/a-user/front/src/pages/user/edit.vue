<template>
  <eb-page>
    <eb-navbar :title="$text('Info')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :auto="false" :data="user" :params="{module:'a-base',validator: 'user'}" :onPerform="onPerformValidate">
      <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
        <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
        <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Email')">
          <div slot="after">
            <span>{{user.email}}</span>
            <eb-link v-if="configAccount.url.emailConfirm" :eb-href="configAccount.url.emailConfirm">
              {{emailConfirmButtonText}}
            </eb-link>
          </div>
        </eb-list-item>
        <eb-list-item :title="$text('Mobile')">
          <div slot="after">
            <span>{{user.mobile}}</span>
            <eb-link v-if="configAccount.url.mobileVerify" :eb-href="configAccount.url.mobileVerify">
              {{mobileVerifyButtonText}}
            </eb-link>
          </div>
        </eb-list-item>
        <f7-list-item divider></f7-list-item>
        <eb-list-item-validate dataKey="motto"></eb-list-item-validate>
        <eb-list-item-validate dataKey="locale"></eb-list-item-validate>
      </eb-list>
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
  computed: {
    emailConfirmButtonText() {
      return (!this.user.email || this.user.emailConfirmed) ? this.$text('Change') : this.$text('Confirm');
    },
    mobileVerifyButtonText() {
      return (!this.user.mobile || this.user.mobileVerified) ? this.$text('Change') : this.$text('Verify');
    },
  },
  created() {
    const configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
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
