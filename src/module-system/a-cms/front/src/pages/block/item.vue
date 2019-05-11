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
      item: null,
    };
  },
  computed: {
    block() {
      return this.contextParams && this.contextParams.block;
    },
    title() {
      if (!this.block) return this.$text('Block');
      return `${this.$text('Block')}: ${this.block.meta.titleLocale}`;
    },
    validateParams() {
      if (!this.block) return null;
      return {
        module: this.block.meta.module,
        validator: this.block.meta.validator,
      };
    },
  },
  mounted() {
    this.item = this.block.data.default;
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
      return this.$view.dialog.confirm().then(() => {
        return this.$refs.validate.perform();
      });
    },
    onSubmit() {
      return this.onPerformDone();
    },
  },
};

</script>
<style scoped>
</style>
