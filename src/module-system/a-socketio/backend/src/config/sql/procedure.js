module.exports = ctx => {
  class Procedure {

    offset({ iid, tableName, where, orders, page, comment, file, count }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- h: aComment
      // -- i: aFile

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _commentField,
        _commentJoin,
        _commentWhere;
      let _fileField,
        _fileJoin,
        _fileWhere;
      let _itemField,
        _itemJoin;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // comment
      if (comment) {
        _commentField =
             ',h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName';
        _commentJoin = ' inner join aViewComment h on h.atomId=a.id';
        _commentWhere = ` and h.iid=${iid} and h.deleted=0`;
      } else {
        _commentField = '';
        _commentJoin = '';
        _commentWhere = '';
      }

      // file
      if (file) {
        _fileField = ',i.id i_id,i.createdAt i_createdAt,i.updatedAt i_updatedAt,i.userId i_userId,i.downloadId i_downloadId,i.mode i_mode,i.fileSize i_fileSize,i.width i_width,i.height i_height,i.filePath i_filePath,i.fileName i_fileName,i.realName i_realName,i.fileExt i_fileExt,i.encoding i_encoding,i.mime i_mime,i.attachment i_attachment,i.flag i_flag,i.userName i_userName,i.avatar i_avatar';
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

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField}
                a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar
                ${_commentField} ${_fileField}`;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}
            ${_commentJoin}
            ${_fileJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_commentWhere}
             ${_fileWhere}
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
