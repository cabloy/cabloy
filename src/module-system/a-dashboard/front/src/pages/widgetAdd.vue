<template>
  <eb-page>
    <eb-navbar :title="$text('Add Widget')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  methods: {
    onPerformDone() {
      const valueNew = this.value + 1;
      this.contextCallback(200, { value: valueNew });
      this.$f7router.back();
    },
  },

}

</script>
