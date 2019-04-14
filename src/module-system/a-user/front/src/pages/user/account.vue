<template>
  <eb-page>
    <eb-navbar :title="$text('Account')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Info')" eb-href="user/edit"></eb-list-item>
      <eb-list-item v-if="configAccount.url.passwordChange" :title="$text('Change password')" :eb-href="configAccount.url.passwordChange"></eb-list-item>
      <template v-if="!$config.agent.disabled">
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Agent')" eb-href="user/agent"></eb-list-item>
      </template>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      configAccount: null,
    };
  },
  created() {
    const configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {},
};

</script>
