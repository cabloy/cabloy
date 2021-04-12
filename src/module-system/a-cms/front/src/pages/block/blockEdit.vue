<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate v-if="item" ref="validate" :readOnly="false" auto :data="item" :params="validateParams" :host="host" :onPerform="onPerformValidate" @submit="onSubmit">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      item: null,
    };
  },
  computed: {
    title() {
      return `${this.$text('Block')}: ${this.block.atomNameLocale}`;
    },
    block() {
      return this.contextParams.block;
    },
    atomId() {
      return this.contextParams.atomId;
    },
    resourceConfig() {
      return JSON.parse(this.block.resourceConfig);
    },
    host() {
      return { atomId: this.atomId };
    },
    validateParams() {
      return {
        module: this.resourceConfig.validator.module,
        validator: this.resourceConfig.validator.validator,
      };
    },
  },
  created() {
    this.item = this.resourceConfig.default;
  },
  methods: {
    onPerformValidate() {
      const blockName = this.block.atomStaticKey;
      return this.$api.post('site/blockSave', {
        blockName,
        item: this.item,
      }).then(data => {
        // callback
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
