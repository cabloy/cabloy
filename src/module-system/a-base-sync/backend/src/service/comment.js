const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');

module.exports = app => {

  class Comment extends app.Service {

    async list({ key, options, user }) {
      const _options = {};
      // where
      _options.where = options.where || {};
      _options.where.iid = this.ctx.instance.id;
      _options.where.deleted = 0;
      _options.where.atomId = key.atomId;
      // orders
      _options.orders = options.orders;
      // page
      if (options.page.size !== 0) {
        _options.limit = options.page.size;
        _options.offset = options.page.index;
      }
      // sql
      const _where = this.ctx.model._where2(_options.where);
      const _orders = this.ctx.model._orders(_options.orders);
      const _limit = this.ctx.model._limit(_options.limit, _options.offset);
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         ${_where} ${_orders} ${_limit}`;
      // select
      return await this.ctx.model.query(sql, [ this.ctx.instance.id, user.id ]);
    }

    async item({ key, data: { commentId }, user }) {
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         where a.iid=? and a.deleted=0 and a.id=?`;
      // select
      const list = await this.ctx.model.query(sql,
        [ this.ctx.instance.id, user.id, this.ctx.instance.id, commentId ]
      );
      return list[0];
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
      if (key.atomId !== item.atomId || item.userId !== user.id) this.ctx.throw(403);
      // html
      const html = this._renderContent({
        content,
        replyContent: item.replyContent,
        replyUserName: item.replyUserName,
      });
      // summary
      const summary = this._trimHtml(html);
      // update
      await this.ctx.model.comment.update({
        id: commentId,
        content,
        summary: summary.html,
        html,
        updatedAt: new Date(),
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
      const list = await this.ctx.model.query(
        'select max(sorting) as sorting from aComment where iid=? and deleted=0 and atomId=?',
        [ this.ctx.instance.id, key.atomId ]);
      const sorting = (list[0].sorting || 0) + 1;
      // reply
      let reply;
      if (replyId) {
        reply = await this.ctx.model.commentView.get({ id: replyId });
      }
      // replyContent
      const replyContent = !reply ? '' :
        this._fullContent({ content: reply.content, replyContent: reply.replyContent, replyUserName: reply.replyUserName });
      // html
      const html = this._renderContent({
        content,
        replyContent,
        replyUserName: reply && reply.userName,
      });
      // summary
      const summary = this._trimHtml(html);
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
        summary: summary.html,
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
      if (key.atomId !== item.atomId || item.userId !== user.id) this.ctx.throw(403);
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

    async heart({ key, data: { commentId, heart }, user }) {
      let diff = 0;
      // check if exists
      const _heart = await this.ctx.model.commentHeart.get({
        userId: user.id,
        atomId: key.atomId,
        commentId,
      });
      if (_heart && !heart) {
        diff = -1;
        // delete
        await this.ctx.model.commentHeart.delete({
          id: _heart.id,
        });
      } else if (!_heart && heart) {
        diff = 1;
        // new
        await this.ctx.model.commentHeart.insert({
          userId: user.id,
          atomId: key.atomId,
          commentId,
          heart: 1,
        });
      }
      // get
      const item = await this.ctx.model.comment.get({ id: commentId });
      let heartCount = item.heartCount;
      if (diff !== 0) {
        heartCount += diff;
        await this.ctx.model.comment.update({
          id: commentId,
          heartCount,
        });
      }
      // ok
      return {
        action: 'heart',
        atomId: key.atomId,
        commentId,
        heart, heartCount,
      };
    }

    _fullContent({ content, replyContent, replyUserName }) {
      if (!replyContent) return content;
      return `${content}

> \`${replyUserName}\`:

::: comment-quot
${replyContent}
:::

`;
    }

    _renderContent({ content, replyContent, replyUserName }) {
      const _content = this._fullContent({ content, replyContent, replyUserName });
      const md = markdown.create();
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return this.ctx.text(...args);
          },
        },
      };
      md.use(markdonw_it_block, blockOptions);
      // render
      return md.render(_content);
    }

    _trimHtml(html) {
      return trimHtml(html, this.ctx.config.comment.trim);
    }

  }

  return Comment;
};
