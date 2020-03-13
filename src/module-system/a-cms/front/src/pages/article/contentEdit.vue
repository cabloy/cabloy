<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
        <eb-link v-if="!!$device.desktop" iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="module">
      <eb-box>
        <mavon-editor ref="editor" :value="item.content" @change="onChange" @save="onSave" :onImageUpload="onImageUpload" :onAudioUpload="onAudioUpload" :onBlockAdd="onBlockAdd" :language="language" :subfield="subfield" :editable="editable" :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :navigation="navigation" :toolbars="toolbars" />
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
    editable() {
      return !this.readOnly;
    },
    language() {
      const locale = this.$meta.util.cookies.get('locale') || 'en-us';
      return locale === 'zh-cn' ? 'zh-CN' : 'en';
    },
    subfield() {
      return this.editable && this.$view.size !== 'small';
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
        audiolink: false,
        code: true, // code
        table: true, // 表格
        block: true, // 区块
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
  created() {
    this.$meta.module.use('a-mavoneditor', module => {
      this.module = module;
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChange(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
    },
    onSave() {
      this.onPerformSave().then(() => {
        this.$view.toast.show();
      });
    },
    onPerformSave() {
      return this.contextParams.ctx.onSave().then(() => {
        this.dirty = false;
        return true;
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
      return this.$api.post('render/getArticleUrl', {
        atomClass: this.atomClass,
        key: { atomId: this.item.atomId },
      }).then(data => {
        window.open(data.url, `cms_article_${this.atomClass.module}_${this.item.atomId}`);
      });
    },
    onImageUpload() {
      return this.onUpload(1, this.item.atomId);
    },
    onAudioUpload() {
      return this.onUpload(3, this.item.atomId);
    },
    onUpload(mode, atomId) {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode,
              atomId,
            },
            callback: (code, data) => {
              if (code === 200) {
                resolve({ text: data.realName, addr: data.downloadUrl });
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });
    },
    onBlockAdd() {
      const atomId = this.item.atomId;
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/cms/block/list', {
          target: '_view',
          context: {
            params: {
              atomId,
            },
            callback: (code, data) => {
              if (code === 200) {
                // data: {name,content}
                resolve(data);
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });
    },
  },
};

</script>
<style lang="less" scoped>
</style>
