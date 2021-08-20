<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" ref="buttonSubmit" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate
      ref="validate"
      :readOnly="readOnly"
      auto
      :data="data"
      :dataPathRoot="dataPathRoot"
      :errors="errors"
      :params="params"
      :host="host"
      :meta="meta"
      @submit="onFormSubmit"
      @validateItem:change="onValidateItemChange"
    ></eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageContext, ebPageDirty],
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
    page_title() {
      return this.page_getDirtyTitle(this.title);
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
      this.page_setDirty(false);
      this.$f7router.back();
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
  },
};
</script>
