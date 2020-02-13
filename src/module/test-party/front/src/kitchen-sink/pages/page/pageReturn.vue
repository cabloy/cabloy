<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Plus')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block>
      <div class="alert-info">
        <span>{{value}}</span>
        <span> -> </span>
        <span>{{value+1}}</span>
      </div>
    </f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    value() {
      return this.contextParams.value;
    },
  },
  methods: {
    onPerformDone() {
      const valueNew = this.value + 1;
      this.contextCallback(200, { value: valueNew });
      this.$f7router.back();
    },
  },
};

</script>
