<template>
  <eb-page>
    <eb-navbar :title="$text('Select atom class')" eb-back-link="Back"></eb-navbar>
    <f7-button @click="onClick">done</f7-button>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {

    };
  },
  computed: {
    mode() {
      return this.contextParams.mode;
    },
    atomId() {
      return this.contextParams.atomId;
    },

  },
  methods: {
    onClick() {
      this.contextCallback(200, this.mode);
      this.$f7router.back();
    },
  },
};

</script>
