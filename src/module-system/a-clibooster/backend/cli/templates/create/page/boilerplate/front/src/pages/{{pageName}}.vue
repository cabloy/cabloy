<template>
  <eb-page>
    <eb-navbar :title="$text('Demo')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::done" ref="buttonDone" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block-title medium></f7-block-title>
    <f7-block strong></f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    async onPerformDone() {
      await this.$view.dialog.confirm();
      return true;
    },
  },
};
</script>
<style lang="less" scoped></style>
