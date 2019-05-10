<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" :readOnly="false" auto :data="item" :params="validateParams" :onPerform="onPerformValidate" @submit.prevent="onSubmit">
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
      item: {},
    };
  },
  computed: {
    block() {
      return this.contextParams.block;
    },
    title() {
      return `${this.$text('Block')}: ${this.block.meta.titleLocale}`;
    },
    validateParams() {
      return {
        module: this.block.meta.module,
        validator: this.block.meta.validator,
      };
    },
  },
  methods: {
    onPerformValidate() {
      const blockName = this.block.meta.name;
      return this.$api.post('site/blockSave', {
        blockName,
        item: this.item,
      }).then(data => {
        this.contextCallback(200, { name: blockName, content: data });
        this.$f7router.back();
      });
    },
    onPerformDone() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      return this.onPerformDone();
    },
  },
};

</script>
<style scoped>
</style>
