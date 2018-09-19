const require3 = require('require3');
const markdown = require3('@zhennann/markdown');

module.exports = app => {

  class Comment extends app.Service {

    async list({ key, options, user }) {
      const _options = {};
      // where
      _options.where = options.where || {};
      _options.where.atomId = key.atomId;
      // orders
      _options.orders = options.orders;
      // page
      if (options.page.size !== 0) {
        _options.limit = options.page.size;
        _options.offset = options.page.index;
      }
      // select
      return await this.ctx.model.commentView.select(_options);
    }

    async save({ key, data, user }) {
      if (!data.commentId) {
        return await this.save_add({ key, data, user });
      }
      return await this.save_edit({ key, data, user });
    }

    async save_edit({ key, data: { commentId, content }, user }) {
      // comment
      const item = await this.ctx.model.commentView.get({ id: commentId });
      if (item.userId !== user.id) this.ctx.throw(403);
      // html
      const html = this._renderContent({
        content,
        replyContent: item.replyContent,
        replyUserName: item.replyUserName,
      });
      // update
      await this.ctx.model.comment.update({
        id: commentId,
        content,
        html,
      });
      // ok
      return {
        action: 'update',
        atomId: key.atomId,
        commentId,
      };
    }

    async save_add({ key, data: { replyId, content }, user }) {
      // sorting
      const list = await this.ctx.model.query('select max(sorting) as sorting from aComment');
      const sorting = (list[0].sorting || 0) + 1;
      // reply
      let reply;
      if (replyId) {
        reply = await this.ctx.model.commentView.get({ id: replyId });
      }
      // replyContent
      const replyContent = reply ? reply.content : '';
      // html
      const html = this._renderContent({
        content,
        replyContent,
        replyUserName: reply && reply.userName,
      });
      // create
      const res = await this.ctx.model.comment.insert({
        atomId: key.atomId,
        userId: user.id,
        sorting,
        heartCount: 0,
        replyId,
        replyUserId: reply ? reply.userId : 0,
        replyContent,
        content,
        html,
      });
      // commentCount
      await this.ctx.meta.atom.comment({ key, atom: { comment: 1 }, user });
      // ok
      return {
        action: 'create',
        atomId: key.atomId,
        commentId: res.insertId,
      };
    }

    async delete({ key, data: { commentId }, user }) {
      // comment
      const item = await this.ctx.model.comment.get({ id: commentId });
      if (item.userId !== user.id) this.ctx.throw(403);
      // delete hearts
      await this.ctx.model.commentHeart.delete({ commentId });
      // delete comment
      await this.ctx.model.comment.delete({ id: commentId });
      // commentCount
      await this.ctx.meta.atom.comment({ key, atom: { comment: -1 }, user });
      // ok
      return {
        action: 'delete',
        atomId: key.atomId,
        commentId,
      };
    }

    async item({ key, data: { commentId }, user }) {
      return await this.ctx.model.commentView.get({ id: commentId });
    }

    _renderContent({ content, replyContent, replyUserName }) {
      let _content;
      if (!replyContent) {
        _content = content;
      } else {
        _content =
`

> \`${replyUserName}\`:
> ${replyContent}
`;
      }
      const md = markdown.create();
      return md.render(_content);
    }

  }

  return Comment;
};
