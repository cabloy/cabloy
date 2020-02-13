<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Settings')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item :title="$text('Instance Settings')" link="#" eb-href="/a/settings/instance/edit?module=test-party"></eb-list-item>
      <eb-list-item :title="$text('User Settings')" link="#" eb-href="/a/settings/user/edit?module=test-party"></eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {},
};

</script>
