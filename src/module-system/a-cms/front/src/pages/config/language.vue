<template>
  <eb-page>
    <eb-navbar :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSave" iconF7="::save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-json-editor
      v-if="ready"
      ref="jsonEditor"
      :readOnly="false"
      valueType="object"
      :value="content"
      @input="onInput"
      @save="onSaveEditor"
    ></eb-json-editor>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import utils from '../../common/utils.js';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
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
    title() {
      const _title = this.$text('Language');
      return `${_title}: ${this.language}`;
    },
    page_title() {
      return this.page_getDirtyTitle(this.title);
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      // get content
      const res = await this.$api.post('site/getConfigLanguage', {
        atomClass: this.atomClass,
        language: this.language,
      });
      this.content = res.data;
      // ok
      this.ready = true;
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onInput(value) {
      this.content = value;
      this.page_setDirty(true);
    },
    onSaveEditor() {
      this.$refs.buttonSave.onClick();
    },
    async onPerformSave() {
      await this.$api.post('site/setConfigLanguage', {
        atomClass: this.atomClass,
        language: this.language,
        data: this.content,
      });
      this.page_setDirty(false);
      this.$emit('preview');
      return true;
    },
    onPerformPreview() {
      const url = this.combineAtomClass(`/a/cms/config/languagePreview?language=${this.language}`);
      this.$view.navigate(url, {
        context: {
          params: {
            source: this,
          },
        },
      });
    },
  },
};
</script>
<style scoped></style>
