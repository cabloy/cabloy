<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="done" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :readOnly="readOnly" auto :data="data" :dataPathRoot="dataPathRoot" :errors="errors" :params="params" @submit="onFormSubmit">
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
    params() {
      return this.contextParams.params;
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
    onSave() {
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
