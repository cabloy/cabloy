<template>
  <eb-page>
    <eb-navbar :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSave" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <template v-if="ready">
      <eb-box>
        <eb-markdown-editor ref="editor" :readOnly="readOnly" :host="host" :value="content" @input="onInput" @save="onSave" />
      </eb-box>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
  meta: {
    size: 'medium',
  },
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      commentId: parseInt(this.$f7route.query.commentId || 0),
      replyId: parseInt(this.$f7route.query.replyId || 0),
      module: null,
      comment: null,
      reply: null,
      content: '',
    };
  },
  computed: {
    page_title() {
      const title = this.$text('Comment');
      return this.page_getDirtyTitle(title);
    },
    ready() {
      return this.module && (this.commentId === 0 || this.comment) && (this.replyId === 0 || this.reply);
    },
    readOnly() {
      return false;
    },
    host() {
      return {
        atomId: this.atomId,
      };
    },
  },
  created() {
    this.$meta.module.use('a-markdown', module => {
      this.module = module;
    });
    this.loadComment(this.commentId);
    this.loadReply(this.replyId);
  },
  methods: {
    async loadComment(commentId) {
      if (!commentId) return;
      const data = await this.$api.post('/a/base/comment/item', {
        key: { atomId: this.atomId },
        data: { commentId },
      });
      this.comment = data;
      this.content = this.comment.content;
    },
    async loadReply(replyId) {
      if (!replyId) return;
      const data = await this.$api.post('/a/base/comment/item', {
        key: { atomId: this.atomId },
        data: { commentId: replyId },
      });
      this.reply = data;
    },
    onInput(data) {
      if (this.content === data) return;
      this.content = data;
      this.page_setDirty(true);
    },
    onSave() {
      this.$refs.buttonSave.onClick();
    },
    async onPerformSave() {
      if (!this.content) return;
      const data = await this.$api.post('/a/base/comment/save', {
        key: { atomId: this.atomId },
        data: {
          commentId: this.commentId,
          replyId: this.replyId,
          content: this.content,
        },
      });
      this.page_setDirty(false);
      this.$meta.eventHub.$emit('comment:action', data);
      const returnTo = this.$f7route.query.returnTo;
      if (returnTo) {
        location.assign(returnTo);
      } else {
        this.$f7router.back();
      }
    },
    onPreRender(value) {
      if (this.comment) {
        return this.fullContent({
          content: value,
          replyContent: this.comment.replyContent,
          replyUserName: this.comment.replyUserName,
        });
      }
      if (this.reply) {
        // replyContent
        const replyContent = this.fullContent({
          content: this.reply.content,
          replyContent: this.reply.replyContent,
          replyUserName: this.reply.replyUserName,
        });
        return this.fullContent({
          content: value,
          replyContent,
          replyUserName: this.reply.userName,
        });
      }
      return value;
    },
    fullContent({ content, replyContent, replyUserName }) {
      if (!replyContent) return content;
      const sep = this._getMarkdownSep(replyContent);
      return `${content}

> \`${replyUserName}\`:

${sep} comment-quot
${replyContent}
${sep}

`;
    },
    _getMarkdownSep(replyContent) {
      const posA = replyContent.indexOf(':::');
      if (posA === -1) return ':::';
      let posB = posA + 3;
      while (replyContent[posB] === ':') {
        ++posB;
      }
      return ':'.repeat(posB - posA + 1);
    },
  },
};
</script>
