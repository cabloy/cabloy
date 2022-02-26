<template>
  <eb-page>
    <eb-navbar :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSave" iconF7="::save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconF7="::info-circle" :eb-href="combineAtomClass('config/siteBase')"></eb-link>
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
      content: null,
      ready: false,
    };
  },
  computed: {
    title() {
      return this.$text('Site Configuration');
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
      this.content = await this.$local.dispatch('getConfigSite', {
        atomClass: this.atomClass,
      });
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
      const data = this.content;
      await this.$api.post('site/setConfigSite', {
        atomClass: this.atomClass,
        data,
      });
      this.page_setDirty(false);
      // change
      this.$local.commit('setConfigSite', { atomClass: this.atomClass, configSite: data });
      // refetch languages
      this.$local.commit('setLanguages', { atomClass: this.atomClass, languages: null });
      this.$local.dispatch('getLanguages', { atomClass: this.atomClass });
      return true;
    },
  },
};
</script>
<style></style>
