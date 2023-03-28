module.exports = ctx => {
  class Procedure {
    async _selectAtoms_draft({
      iid,
      userIdWho,
      tableName,
      where,
      orders,
      page,
      star,
      label,
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
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _languageWhere;
      let _categoryWhere;
      let _tagJoin, _tagWhere;

      let _starJoin, _starWhere;

      let _labelJoin, _labelWhere;
      let _commentField, _commentJoin, _commentWhere;

      let _fileField, _fileJoin, _fileWhere;

      let _itemField, _itemJoin;

      let _atomClassWhere;

      // cms
      const { _cmsField, _cmsJoin, _cmsWhere } = this._prepare_cms({ tableName, iid, mode, cms });

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // language
      if (language) {
        _languageWhere = ctx.model.format(' and a.atomLanguage=?', language);
      } else {
        _languageWhere = '';
      }

      // category
      if (category) {
        _categoryWhere = ` and a.atomCategoryId=${category}`;
      } else {
        _categoryWhere = '';
      }

      // tag
      if (tag) {
        _tagJoin = ' inner join aTagRef k on k.atomId=a.id';
        _tagWhere = ` and k.iid=${iid} and k.tagId=${tag}`;
      } else {
        _tagJoin = '';
        _tagWhere = '';
      }

      // star
      if (star) {
        _starJoin = ' inner join aAtomStar d on a.id=d.atomId';
        _starWhere = ` and d.iid=${iid} and d.userId=${userIdWho} and d.star=1`;
      } else {
        _starJoin = '';
        _starWhere = '';
      }
      const _starField = `,(select d2.star from aAtomStar d2 where d2.iid=${iid} and d2.atomId=a.id and d2.userId=${userIdWho}) as star`;

      // label
      if (label) {
        _labelJoin = ' inner join aAtomLabelRef e on a.id=e.atomId';
        _labelWhere = ` and e.iid=${iid} and e.userId=${userIdWho} and e.labelId=${label}`;
      } else {
        _labelJoin = '';
        _labelWhere = '';
      }
      const _labelField = `,(select e2.labels from aAtomLabel e2 where e2.iid=${iid} and e2.atomId=a.id and e2.userId=${userIdWho}) as labels`;

      // comment
      if (comment) {
        _commentField = `,h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName,
               (select h2.heart from aCommentHeart h2 where h2.iid=${iid} and h2.commentId=h.id and h2.userId=${userIdWho}) as h_heart`;

        _commentJoin = ' inner join aViewComment h on h.atomId=a.id';
        _commentWhere = ` and h.iid=${iid} and h.deleted=0`;
      } else {
        _commentField = '';
        _commentJoin = '';
        _commentWhere = '';
      }

      // file
      if (file) {
        _fileField =
          ',i.id i_id,i.createdAt i_createdAt,i.updatedAt i_updatedAt,i.userId i_userId,i.downloadId i_downloadId,i.mode i_mode,i.fileSize i_fileSize,i.width i_width,i.height i_height,i.filePath i_filePath,i.fileName i_fileName,i.realName i_realName,i.fileExt i_fileExt,i.encoding i_encoding,i.mime i_mime,i.attachment i_attachment,i.flag i_flag,i.userName i_userName,i.avatar i_avatar';
        _fileJoin = ' inner join aViewFile i on i.atomId=a.id';
        _fileWhere = ` and i.iid=${iid} and i.deleted=0`;
      } else {
        _fileField = '';
        _fileJoin = '';
        _fileWhere = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // atomClass inner
      // eslint-disable-next-line
      _atomClassWhere = '';
      // if (atomClass || star || label) {
      //   _atomClassWhere = '';
      // } else {
      //   _atomClassWhere = await this._prepare_atomClassIdsInner();
      // }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField} ${_cmsField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,a.atomTags,
                a.atomSimple,a.atomDisabled,a.atomState,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt
                ${_starField} ${_labelField} ${_commentField}
                ${_fileField}
              `;
      }

      // sql
      const _sql = `select ${_selectFields} from aAtom a
            ${_itemJoin}
            ${_tagJoin}
            ${_starJoin}
            ${_labelJoin}
            ${_commentJoin}
            ${_fileJoin}
            ${_cmsJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid} and a.atomStage=${stage} and a.atomClosed=0 and a.userIdUpdated=${userIdWho}
             ${_atomClassWhere}
             ${_languageWhere}
             ${_categoryWhere}
             ${_tagWhere}
             ${_starWhere}
             ${_labelWhere}
             ${_commentWhere}
             ${_fileWhere}
             ${_cmsWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }
  }
  return Procedure;
};
