<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <mavon-editor ref="editor" :value="item.content" @change="onChange" @save="onSave" @imgAdd="onImgAdd" :language="language" :subfield="subfield" :editable="editable" :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :navigation="navigation" :toolbars="toolbars" />
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  data() {
    return {
      dirty: false,
      module: null,
      _unwatch: null,
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
    language() {
      const locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return locale === 'zh-cn' ? 'zh-CN' : 'en';
    },
    subfield() {
      return this.editable && this.$view.size !== 'small';
    },
    editable() {
      return !this.readOnly;
    },
    defaultOpen() {
      return this.editable ? '' : 'preview';
    },
    toolbarsFlag() {
      return this.editable;
    },
    navigation() {
      return !this.editable;
    },
    toolbars() {
      return {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
      };
    },
  },
  mounted() {
    this.$meta.module.use('a-mavoneditor', module => {
      this.module = module;
      this.onSize();
    });
    this._unwatch = this.$view.$watch('sizeExtent', () => {
      this.onSize();
    });
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    onSize() {
      this.$nextTick(() => {
        const size = this.$view.sizeExtent;
        if (size) {
          this.$$(this.$refs.editor.$el).css({
            height: `${size.height - 64}px`,
            width: `${size.width}px`,
          });
        }
      });
    },
    onChange(data) {
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave() {
      this.onPerformSave();
    },
    onPerformSave() {
      this.contextParams.ctx.onSave();
      this.dirty = false;
    },
    onPerformPreview() {

    },
    onImgAdd(pos, file) {
      console.log(pos, file);
    },
  },
};

</script>
<style lang="less" scoped>


</style>
