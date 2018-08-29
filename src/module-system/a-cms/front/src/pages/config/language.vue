<template>
  <eb-page>
    <eb-navbar :title="$text('cms')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')" eb-href="config/site"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {};
  },
  methods: {},
};

</script>
