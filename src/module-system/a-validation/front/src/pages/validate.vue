<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="schemaReady" iconMaterial="done" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :readOnly="readOnly" auto :data="data" :dataPathRoot="dataPathRoot" :errors="errors" :params="params" @schema:ready="onSchemaReady">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      schemaReady: false,
      title: '',
    };
  },
  computed: {
    params() {
      return this.contextParams;
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
    onSchemaReady(schema) {
      this.schemaReady = true;
      this.title = schema.ebTitle;
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
