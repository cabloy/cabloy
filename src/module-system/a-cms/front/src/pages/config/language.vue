<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="json-textarea json-textarea-margin"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      language: this.$f7route.query.language,
      content: '{}',
    };
  },
  computed: {
    title() {
      const _title = this.$text('Language');
      return `${_title}: ${this.language}`;
    },
  },
  created() {
    this.$api.post('site/getConfigLanguage', {
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
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      this.content = event.target.value;
    },
    onPerformSave() {
      const data = JSON5.parse(this.content);
      return this.$api.post('site/setConfigLanguage', {
        atomClass: this.atomClass,
        language: this.language,
        data,
      }).then(() => {
        this.$emit('preview');
        return true;
      });
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
<style scoped>
</style>
