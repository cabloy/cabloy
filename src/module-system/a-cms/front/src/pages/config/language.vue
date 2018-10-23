<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-box @size="onSize">
      <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="json-textarea"></textarea>
    </eb-box>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
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
    this.$api.post('site/getConfigLanguage', { language: this.language }).then(res => {
      if (!res.data) {
        this.content = '{}';
      } else {
        this.content = JSON.stringify(res.data, null, 2);
      }
    });
  },
  methods: {
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
      const data = JSON.parse(this.content);
      return this.$api.post('site/setConfigLanguage', {
        language: this.language,
        data,
      }).then(() => {
        this.$emit('preview');
        return true;
      });
    },
    onPerformPreview() {
      this.$view.navigate(`/a/cms/config/languagePreview?language=${this.language}`, {
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
<style>
</style>
