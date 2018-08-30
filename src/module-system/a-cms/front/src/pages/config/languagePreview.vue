<template>
  <eb-page>
    <eb-navbar :title="$text('Preview')" eb-back-link="Back">
    </eb-navbar>
    <textarea ref="textarea" type="textarea" readonly="readonly" :value="content" class="cms-json-textarea"></textarea>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      language: this.$f7route.query.language,
      content: '{}',
      _unwatch: null,
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
    // size
    this._unwatch = this.$view.$watch('sizeExtent', () => {
      this.onSize();
    });
    this.onSize();
    // preview
    if (this.source) {
      this.source.$on('preview', this.onPreview);
    }
  },
  beforeDestroy() {
    // size
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
    // preview
    if (this.source) {
      this.source.$off('preview', this.onPreview);
    }
  },
  methods: {
    onPreview() {
      this.onLoad();
    },
    onLoad() {
      this.$api.post('site/getConfigLanguagePreview', { language: this.language }).then(res => {
        if (!res.data) {
          this.content = '{}';
        } else {
          this.content = JSON.stringify(res.data, null, 2);
        }
      });
    },
    onSize() {
      const size = this.$view.sizeExtent;
      if (size) {
        this.$$(this.$refs.textarea).css({
          height: `${size.height - 84}px`,
          width: `${size.width - 20}px`,
        });
      }
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
