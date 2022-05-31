const require3 = require('require3');
const trimHtml = require3('@zhennann/trim-html');

module.exports = app => {
  class Comment extends app.Service {
    async list({ key, options, user }) {
      const _options = this._adjuctOptions({ key, options });
      // sql
      const _where = this.ctx.model._where(_options.where);
      const _orders = this.ctx.model._orders(_options.orders);
      const _limit = this.ctx.model._limit(_options.limit, _options.offset);
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         ${_where} ${_orders} ${_limit}`;
      // select
      return await this.ctx.model.query(sql, [this.ctx.instance.id, user.id]);
    }

    async count({ key, options, user }) {
      const _options = this._adjuctOptions({ key, options });
      // sql
      const _where = this.ctx.model._where(_options.where);
      const sql = `select count(*) as count from aViewComment a
         ${_where}`;
      // query
      const res = await this.ctx.model.queryOne(sql);
      return res.count;
    }

    _adjuctOptions({ key, options }) {
      const _options = {};
      // where
      _options.where = options.where || {};
      _options.where.iid = this.ctx.instance.id;
      _options.where.deleted = 0;
      _options.where.atomId = key.atomId;
      // orders
      _options.orders = options.orders;
      // page
      if (options.page && options.page.size !== 0) {
        _options.limit = options.page.size;
        _options.offset = options.page.index;
      }
      return _options;
    }

    async item({ /* key,*/ data: { commentId }, user }) {
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         where a.iid=? and a.deleted=0 and a.id=?`;
      // select
      const list = await this.ctx.model.query(sql, [this.ctx.instance.id, user.id, this.ctx.instance.id, commentId]);
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
      const html = await this._renderContent({
        atomId: key.atomId,
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
      // publish
      await this._publish({
        atomId: key.atomId,
        commentId,
        replyId: item.replyId,
        replyUserId: item.replyUserId,
        user,
        mode: 'edit',
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
        [this.ctx.instance.id, key.atomId]
      );
      const sorting = (list[0].sorting || 0) + 1;
      // reply
      let reply;
      if (replyId) {
        reply = await this.ctx.model.commentView.get({ id: replyId });
      }
      // replyUserId
      const replyUserId = reply ? reply.userId : 0;
      // replyContent
      let replyContent = '';
      if (reply) {
        replyContent = this._fullContent({
          content: reply.content,
          replyContent: reply.replyContent,
          replyUserName: reply.replyUserName,
        });
      }
      // html
      const html = await this._renderContent({
        atomId: key.atomId,
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
        replyUserId,
        replyContent,
        content,
        summary: summary.html,
        html,
      });
      const commentId = res.insertId;
      // commentCount
      await this.ctx.bean.atom.comment({ key, atom: { comment: 1 }, user });
      // publish
      await this._publish({ atomId: key.atomId, commentId, replyId, replyUserId, user, mode: 'add' });
      // ok
      return {
        action: 'create',
        atomId: key.atomId,
        commentId,
      };
    }

    async delete({ key, data: { commentId }, user }) {
      // comment
      const item = await this.ctx.model.comment.get({ id: commentId });
      // check right
      let canDeleted = key.atomId === item.atomId && item.userId === user.id;
      if (!canDeleted) {
        canDeleted = await this.ctx.bean.resource.checkRightResource({
          atomStaticKey: 'a-base:deleteComment',
          user,
        });
      }
      if (!canDeleted) this.ctx.throw(403);
      // delete hearts
      await this.ctx.model.commentHeart.delete({ commentId });
      // delete comment
      await this.ctx.model.comment.delete({ id: commentId });
      // commentCount
      await this.ctx.bean.atom.comment({ key, atom: { comment: -1 }, user });
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
        heart,
        heartCount,
      };
    }

    // publish
    async _publish({ atomId, commentId, replyId, replyUserId, user, mode }) {
      const userIdsTo = {};
      // 1. atom.userIdUpdated
      const atom = await this.ctx.model.atom.get({ id: atomId });
      const userIdUpdated = atom.userIdUpdated;
      if (userIdUpdated !== user.id) {
        const title = await this._publishTitle({ userId: userIdUpdated, replyId: 0, mode });
        userIdsTo[userIdUpdated] = { title };
      }
      // 2. replyUser
      if (replyUserId && replyUserId !== user.id) {
        const title = await this._publishTitle({ userId: replyUserId, replyId, mode });
        userIdsTo[replyUserId] = { title };
      }
      // actionPath
      const actionPath = `/a/basefront/comment/list?atomId=${atomId}&commentId=${commentId}`;
      // publish
      for (const userIdTo in userIdsTo) {
        const info = userIdsTo[userIdTo];
        const message = {
          userIdTo,
          content: {
            issuerId: user.id,
            issuerName: user.userName,
            issuerAvatar: user.avatar,
            title: info.title,
            body: atom.atomName,
            actionPath,
            params: {
              atomId,
              commentId,
              replyId,
            },
          },
        };
        await this.ctx.bean.io.publish({
          message,
          messageClass: {
            module: 'a-base',
            messageClassName: 'comment',
          },
        });
      }
    }

    async _publishTitle({ userId, replyId, mode }) {
      const user = await this.ctx.bean.user.get({ id: userId });
      const locale = user.locale;
      let title;
      if (mode === 'add') {
        // add
        if (replyId === 0) {
          title = this.ctx.text.locale(locale, 'CommentPublishTitleNewComment');
        } else {
          title = this.ctx.text.locale(locale, 'CommentPublishTitleReplyComment');
        }
      } else {
        // edit
        if (replyId === 0) {
          title = this.ctx.text.locale(locale, 'CommentPublishTitleEditComment');
        } else {
          title = this.ctx.text.locale(locale, 'CommentPublishTitleEditReplyComment');
        }
      }
      return title;
    }

    _fullContent({ content, replyContent, replyUserName }) {
      if (!replyContent) return content;
      const sep = this._getMarkdownSep(replyContent);
      return `${content}

> \`${replyUserName}\`:

${sep} comment-quot
${replyContent}
${sep}

`;
    }

    _getMarkdownSep(replyContent) {
      const posA = replyContent.indexOf(':::');
      if (posA === -1) return ':::';
      let posB = posA + 3;
      while (replyContent[posB] === ':') {
        ++posB;
      }
      return ':'.repeat(posB - posA + 1);
    }

    async _renderContent({ atomId, content, replyContent, replyUserName }) {
      const fullContent = this._fullContent({ content, replyContent, replyUserName });
      return await this.ctx.bean.markdown.render({
        host: { atomId },
        content: fullContent,
        locale: this.ctx.locale,
      });
    }

    _trimHtml(html) {
      return trimHtml(html, this.ctx.config.comment.trim);
    }
  }

  return Comment;
};
