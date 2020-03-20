<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Clock')" eb-back-link="Back">
    </eb-navbar>
    <eb-validate v-if="item" ref="validate" auto :data="item" :meta="validateMeta" @validateItem:change="onValidateItemChange">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    clock() {
      return this.contextParams.clock;
    },
    schema() {
      return this.contextParams.schema;
    },
    item() {
      return this.contextParams.item;
    },
    validateMeta() {
      return {
        schema: this.schema,
        hint: {
          optional: '',
          must: '',
        },
      }
    },
  },
  mounted() {
    this.clock.$on('section:destroy', this.onSectionDestroy);
  },
  beforeDestroy() {
    this.clock.$off('section:destroy', this.onSectionDestroy);
  },
  methods: {
    onSectionDestroy() {
      this.$view.close();
    },
    onValidateItemChange(key, value) {
      this.contextCallback(200, { key, value });
    },
  },

}

</script>
