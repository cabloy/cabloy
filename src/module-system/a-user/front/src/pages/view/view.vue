<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('ViewLayout')" eb-back-link="Back"></eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Sidebar (Left)')" link="#" eb-href="view/edit?side=left" eb-target="_self"></eb-list-item>
      <eb-list-item :title="$text('Sidebar (Right)')" link="#" eb-href="view/edit?side=right" eb-target="_self"></eb-list-item>
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
