<template>
  <eb-page>
    <eb-navbar :title="$text('Preview')" eb-back-link="Back"></eb-navbar>
    <eb-json-editor v-if="ready" ref="jsonEditor" :readOnly="true" valueType="object" :value="content"></eb-json-editor>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import utils from '../../common/utils.js';
export default {
  mixins: [ebPageContext],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      language: this.$f7route.query.language,
      content: null,
      ready: false,
    };
  },
  computed: {
    params() {
      return this.contextParams;
    },
    source() {
      return this.contextParams && this.contextParams.source;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    // preview
    if (this.source) {
      this.source.$on('preview', this.onPreview);
    }
  },
  beforeDestroy() {
    // preview
    if (this.source) {
      this.source.$off('preview', this.onPreview);
    }
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
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onPreview() {
      this.onLoad();
    },
    async onLoad() {
      const res = await this.$api.post('site/getConfigLanguagePreview', {
        atomClass: this.atomClass,
        language: this.language,
      });
      this.content = res.data;
    },
  },
};
</script>
<style scoped></style>
