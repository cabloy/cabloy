<template>
  <eb-page>
    <eb-navbar :title="$text('Preview')" eb-back-link="Back"></eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="json-textarea"></textarea>
    </eb-box>
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
      content: '{}',
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
    this.onLoad();
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
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onPreview() {
      this.onLoad();
    },
    onLoad() {
      this.$api.post('site/getConfigLanguagePreview', {
        atomClass: this.atomClass,
        language: this.language,
      }).then(res => {
        if (!res.data) {
          this.content = '{}';
        } else {
          this.content = JSON5.stringify(res.data, null, 2);
        }
      });
    },
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
  },
};

</script>
<style>
</style>
