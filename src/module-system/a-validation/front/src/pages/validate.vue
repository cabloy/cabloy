<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" ref="buttonSubmit" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :readOnly="readOnly" auto :data="data" :dataPathRoot="dataPathRoot" :errors="errors" :params="params" :host="host" :meta="meta" @submit="onFormSubmit">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {};
  },
  computed: {
    host() {
      return this.contextParams.host;
    },
    params() {
      return this.contextParams.params;
    },
    meta() {
      return this.contextParams.meta;
    },
    title() {
      return this.contextParams.title;
    },
    data() {
      return this.contextParams.data;
    },
    dataPathRoot() {
      return this.contextParams.dataPathRoot;
    },
    errors() {
      return this.contextParams.errors;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onPerformDone() {
      this.contextCallback(200, {
        data: this.data,
        errors: this.errors,
      });
      this.$f7router.back();
    },
  },
};

</script>
<style scoped>
</style>
