<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Load Component Async')" eb-back-link="Back"></eb-navbar>
    <eb-component module="test-party" name="loadComponentAsync">
      <div slot="scoped" slot-scope="{user}" class="alert-info">Slot: scoped - {{user.name}}</div>
      <div slot="named" class="alert-info">Slot: named</div>
      <div class="alert-info">Slot: default</div>
    </eb-component>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
};

</script>
<style scoped>
</style>
