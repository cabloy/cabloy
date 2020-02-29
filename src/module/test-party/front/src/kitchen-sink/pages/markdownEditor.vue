<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"> </eb-navbar>
    <template v-if="module">
      <eb-box>
        <mavon-editor ref="editor" :value="content" @change="onChange" @save="onSave" :onImageUpload="onImageUpload" :onAudioUpload="onAudioUpload" :onBlockAdd="onBlockAdd" :language="language" :subfield="subfield" :editable="editable" :defaultOpen="defaultOpen" :toolbarsFlag="toolbarsFlag" :navigation="navigation" :toolbars="toolbars" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'medium',
  },
  data() {
    return {
      module: null,
      dirty: false,
      content: '',
    };
  },
  computed: {
    title() {
      return `${this.dirty ? '* ' : ''}Markdown Editor(mavon-editor)`;
    },
    readOnly() {
      return false;
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
      this.content = `
# Markdown Spec

> [Markdown Spec](http://commonmark.org/help/)

---

*Italic*

**Bold**

# Heading 1

## Heading 2

[Link](https://zhennann.com/)

![Image](https://cdn.cabloy.com/assets/img/user.png)

> Blockquote

* List
* List
* List

- [x] Done
- [ ] Doing

1. One
2. Two
3. Three

Horizontal Rule

---

\`Inline code\` with backticks

\`\`\`
# code block
print '3 backticks or'
print 'indent 4 spaces'
\`\`\`

| Title1 | Title2 | Title3 |
| :--  | :--: | ----: |
| Left | Center | Right |


::: alert-success
:::

::: alert-info
:::

::: alert-warning
:::

::: alert-danger
:::

::: hljs-left
Left
:::

::: hljs-center
Center
:::

::: hljs-right
Right
:::

      `;
    });
  },
  methods: {
    onChange(data) {
      if (this.readOnly) return;
      if (this.content === data) return;
      this.dirty = true;
    },
    onSave() {
      this.dirty = false;
      this.$view.toast.show();
    },
    onImageUpload() {
      return this.onUpload(1);
    },
    onAudioUpload() {
      return this.onUpload(3);
    },
    onUpload(mode, atomId) {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode,
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
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/cms/block/list', {
          target: '_view',
          context: {
            params: {},
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
