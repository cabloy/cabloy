<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconF7="::save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate
      ref="validate"
      :auto="false"
      :data="user"
      :params="{ module: 'a-base', validator: 'user' }"
      :onPerform="onPerformValidate"
      @validateItem:change="onValidateItemChange"
    >
      <eb-list form inline-labels no-hairlines-md @submit="onFormSubmit">
        <eb-list-item :title="$text('Username')">
          <div slot="after">
            <span>{{ user.userName }}</span>
            <eb-link v-if="user.allowChangeUserName" eb-href="/a/user/user/changeUserName" eb-target="_self">
              {{ $text('Change') }}
            </eb-link>
          </div>
        </eb-list-item>
        <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Email')">
          <div slot="after">
            <span>{{ user.email }}</span>
            <eb-link v-if="configAccount.url.emailConfirm" :eb-href="configAccount.url.emailConfirm" eb-target="_self">
              {{ emailConfirmButtonText }}
            </eb-link>
          </div>
        </eb-list-item>
        <eb-list-item :title="$text('Mobile')">
          <div slot="after">
            <span>{{ user.mobile }}</span>
            <eb-link v-if="configAccount.url.mobileVerify" :eb-href="configAccount.url.mobileVerify" eb-target="_self">
              {{ mobileVerifyButtonText }}
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
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
  components: {},
  data() {
    return {
      user: Vue.prototype.$utils.extend({}, this.$store.state.auth.user.agent),
      configAccount: null,
    };
  },
  computed: {
    page_title() {
      const title = this.$text('Info');
      return this.page_getDirtyTitle(title);
    },
    emailConfirmButtonText() {
      return !this.user.email || this.user.emailConfirmed ? this.$text('Change') : this.$text('Confirm');
    },
    mobileVerifyButtonText() {
      return !this.user.mobile || this.user.mobileVerified ? this.$text('Change') : this.$text('Verify');
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
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    async onPerformValidate() {
      await this.$api.post('user/save', {
        data: this.user,
      });
      // save
      const userNew = { agent: this.user };
      if (this.$store.state.auth.user.op.id === this.user.id) {
        userNew.op = this.user;
      }
      this.$store.commit('auth/setUser', userNew);
      this.page_setDirty(false);
      this.$f7router.back();
    },
  },
};
</script>
<style lang="less" scoped></style>
