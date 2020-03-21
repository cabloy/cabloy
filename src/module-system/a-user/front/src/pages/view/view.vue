<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('ViewLayout')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Header Buttons')" link="#" eb-href="view/buttons?side=top" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Sidebar (Left)')" link="#" eb-href="view/panels?side=left" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Sidebar (Right)')" link="#" eb-href="view/panels?side=right" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Statusbar (Left)')" link="#" eb-href="view/panels?side=bottom" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Statusbar (Right)')" link="#" eb-href="view/sections?side=bottom" eb-target="_self"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {},
  methods: {},
};

</script>
