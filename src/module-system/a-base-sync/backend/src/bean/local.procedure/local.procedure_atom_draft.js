module.exports = ctx => {
  class Procedure {
    async _selectAtoms_draft({
      iid,
      userIdWho,
      // atomClass,
      // atomClassBase,
      tableName,
      where,
      orders,
      page,
      // star,
      // label,
      comment,
      file,
      count,
      stage,
      language,
      category,
      tag,
      mode,
      cms,
    }) {
      // -- tables
      // -- a: aAtom
      // -- c: aViewUserRightAtomClassRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- h: aComment
      // -- i: aFile
      // -- k: aTagRef
      // -- p: aCmsArticle
      // -- q: aCmsContent

      // for safe
      // tableName = tableName ? ctx.model.format('??', tableName) : null; // not format tableName
      const _where = Object.assign({}, where);
      const _orders = orders ? ctx.model._orders(orders) : '';
      const _limit = page ? ctx.model._limit(page.size, page.index) : '';

      // vars
      let _tagJoin;

      let _commentField, _commentJoin;

      let _fileField, _fileJoin;

      let _itemField, _itemJoin;
      // let _atomField, _atomJoin;

      // cms
      const { _cmsField, _cmsJoin, _cmsWhere } = this._prepare_cms({ tableName, iid, mode, cms });
      _where.__and__cms = _cmsWhere;

      // language
      if (language) {
        _where['a.atomLanguage'] = language;
      }

      // category
      if (category) {
        _where['a.atomCategoryId'] = category;
      }

      // tag
      if (tag) {
        _tagJoin = ' inner join aTagRef k on k.atomId=a.id';
        _where['k.iid'] = iid;
        _where['k.tagId'] = tag;
      } else {
        _tagJoin = '';
      }

      // comment
      if (comment) {
        _commentField = `,h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName,
               (select h2.heart from aCommentHeart h2 where h2.iid=${iid} and h2.commentId=h.id and h2.userId=${userIdWho}) as h_heart`;

        _commentJoin = ' inner join aViewComment h on h.atomId=a.id';
        _where['h.iid'] = iid;
        _where['h.deleted'] = 0;
      } else {
        _commentField = '';
        _commentJoin = '';
      }

      // file
      if (file) {
        _fileField =
          ',i.id i_id,i.createdAt i_createdAt,i.updatedAt i_updatedAt,i.userId i_userId,i.downloadId i_downloadId,i.mode i_mode,i.fileSize i_fileSize,i.width i_width,i.height i_height,i.filePath i_filePath,i.fileName i_fileName,i.realName i_realName,i.fileExt i_fileExt,i.encoding i_encoding,i.mime i_mime,i.attachment i_attachment,i.flag i_flag,i.userName i_userName,i.avatar i_avatar';
        _fileJoin = ' inner join aViewFile i on i.atomId=a.id';
        _where['i.iid'] = iid;
        _where['i.deleted'] = 0;
      } else {
        _fileField = '';
        _fileJoin = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // atom
      const _atomField = `a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
          a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,a.atomTags,
          a.atomSimple,a.atomDisabled,a.atomState,
          a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt`;
      const _atomJoin = 'from aAtom a';
      _where['a.deleted'] = 0;
      _where['a.iid'] = iid;
      _where['a.atomStage'] = stage;
      _where['a.atomClosed'] = 0;
      _where['a.userIdUpdated'] = userIdWho;

      // atomClass inner: need not
      // if (!atomClass) {
      //   _where['a.atomClassId'] = await this._prepare_atomClassIdsInner();
      // }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = this._combineFields([
          //
          _itemField,
          _cmsField,
          _atomField,
          _commentField,
          _fileField,
        ]);
      }

      // where clause
      let _whereClause = ctx.model._formatWhere(_where);
      if (_whereClause === false) return false;
      _whereClause = _whereClause === true ? '' : ` WHERE (${_whereClause})`;

      // sql
      const _sql = `select ${_selectFields} ${_atomJoin}
            ${_itemJoin}
            ${_tagJoin}
            ${_commentJoin}
            ${_fileJoin}
            ${_cmsJoin}

          ${_whereClause}

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }
  }
  return Procedure;
};
