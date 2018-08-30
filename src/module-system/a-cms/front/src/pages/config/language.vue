<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <textarea ref="textarea" type="textarea" :value="content" @input="onInput" class="cms-json-textarea"></textarea>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      language: this.$f7route.query.language,
      content: '{}',
      _unwatch: null,
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
  mounted() {
    this._unwatch = this.$view.$watch('sizeExtent', () => {
      this.onSize();
    });
    this.onSize();
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    onSize() {
      const size = this.$view.sizeExtent;
      if (size) {
        this.$$(this.$refs.textarea).css({
          height: `${size.height - 84}px`,
          width: `${size.width - 20}px`,
        });
      }
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
<style lang="less" scoped>
.cms-json-textarea {
  border: 1px solid #C3D4E7;
  margin: 10px;
  padding: 6px;
  line-height: 1.5;
}

</style>
