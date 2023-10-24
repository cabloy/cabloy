<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" ref="buttonSubmit" iconF7="::done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate
      ref="validate"
      :readOnly="readOnly"
      auto
      :data="dataLocal"
      :dataPathRoot="dataPathRoot"
      :errors="errors"
      :params="params"
      :host="host"
      :meta="meta"
      :onPerform="onPerformValidate"
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
    return {
      dataLocal: null,
    };
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
    performValidate() {
      return this.contextParams.performValidate;
    },
  },
  created() {
    this.dataLocal = this.$meta.util.extend({}, this.data);
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onPerformValidate() {
      return this.$api.post('/a/validation/validation/validate', {
        params: this.params,
        data: this.dataLocal,
      });
    },
    async onPerformDone() {
      // performValidate
      if (this.performValidate) {
        await this.$refs.validate.perform();
      }
      // callback
      this.contextCallback(200, {
        data: this.dataLocal,
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
