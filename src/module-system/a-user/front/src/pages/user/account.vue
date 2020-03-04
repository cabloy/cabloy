<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Account')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <template v-if="user.op.id===user.agent.id">
        <eb-list-item :title="$text('Info')" link="#" eb-href="user/edit" eb-target="_self"></eb-list-item>
        <eb-list-item v-if="configAccount.url.passwordChange" link="#" :title="$text('Change password')" :eb-href="configAccount.url.passwordChange" eb-target="_self"></eb-list-item>
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Authentications')" link="#" eb-href="user/authentications" eb-target="_self"></eb-list-item>
      </template>
      <template v-if="!$config.agent.disabled">
        <f7-list-item divider></f7-list-item>
        <eb-list-item :title="$text('Agent')" link="#" eb-href="user/agent" eb-target="_self"></eb-list-item>
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
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    const configBase = this.$meta.config.modules['a-base'];
    this.configAccount = configBase.account;
  },
  methods: {},
};

</script>
