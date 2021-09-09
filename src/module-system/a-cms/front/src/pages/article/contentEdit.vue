<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" ref="buttonSave" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link v-if="!!$device.desktop" iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <eb-box>
        <eb-markdown-editor ref="editor" :readOnly="readOnly" :host="host" :value="item.content" @input="onInput" @save="onSave" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import utils from '../../common/utils.js';
export default {
  meta: {
    size: 'large',
  },
  mixins: [ebPageContext],
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      dirty: false,
      module: null,
    };
  },
  computed: {
    title() {
      return `${this.dirty ? '* ' : ''}${this.item.atomName}`;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    item() {
      return this.contextParams.item;
    },
    host() {
      return {
        atomId: this.item.atomId,
        atom: this.item,
      };
    },
  },
  created() {
    this.$meta.module.use('a-markdown', module => {
      this.module = module;
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onInput(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave() {
      this.$refs.buttonSave.onClick();
    },
    onPerformSave() {
      return this.contextParams.onSave().then(() => {
        this.dirty = false;
        return this.$text('Saved');
      });
    },
    onPerformPreview() {
      if (this.readOnly) {
        return this._preview();
      }
      return this.onPerformSave().then(() => {
        return this._preview();
      });
    },
    _preview() {
      return this.$api
        .post('render/getArticleUrl', {
          atomClass: this.atomClass,
          key: { atomId: this.item.atomId },
          options: {
            returnWaitingPath: true,
          },
        })
        .then(data => {
          if (!data) return;
          window.open(data.url, `cms_article_${this.atomClass.module}_${this.item.atomId}`);
        });
    },
  },
};
// data: {name,content}
</script>
<style lang="less" scoped></style>
