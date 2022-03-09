<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Appearance')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Language')" link="#" :onPerform="onPerformLanguage"></eb-list-item>
      <eb-list-item :title="$text('Theme')" link="#" eb-href="/a/user/theme" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('ViewLayout')" link="#" :onPerform="onPerformView"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    onPerformLanguage(event) {
      return this.performAction(event, {
        actionModule: 'a-user',
        actionComponent: 'action',
        name: 'appearanceLanguage',
      });
    },
    onPerformView(event) {
      return this.performAction(event, {
        actionModule: 'a-user',
        actionComponent: 'action',
        name: 'appearanceView',
      });
    },
    performAction(event, resourceConfig) {
      const action = this.$utils.extend({}, resourceConfig, {
        targetEl: event.currentTarget,
        navigateOptions: { target: '_self' },
      });
      return this.$meta.util.performAction({ ctx: this, action, item: null });
    },
  },
};
</script>
<style scoped></style>
