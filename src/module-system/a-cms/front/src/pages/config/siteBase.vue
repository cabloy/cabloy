<template>
  <eb-page>
    <eb-navbar :title="$text('Default')" eb-back-link="Back"></eb-navbar>
    <eb-json-editor v-if="ready" ref="jsonEditor" :readOnly="true" valueType="object" :value="content"></eb-json-editor>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      content: null,
      ready: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      // load
      await this.onLoad();
      // ok
      this.ready = true;
    },
    async onLoad() {
      this.content = await this.$local.dispatch('getConfigSiteBase', {
        atomClass: this.atomClass,
      });
    },
  },
};
</script>
<style></style>
