module.exports = ctx => {
  class Procedure {

    selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);
      label = parseInt(label);
      comment = parseInt(comment);
      file = parseInt(file);

      if (userIdWho === 0) return this._selectAtoms_0({ iid, tableName, where, orders, page, comment, file, count });
      return this._selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count });
    }

    _selectAtoms_0({ iid, tableName, where, orders, page, comment, file, count }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtom
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

    _selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtom
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
      let
        _starJoin,
        _starWhere;

      let
        _labelJoin,
        _labelWhere;
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
        _commentField =
             `,h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName,
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
                ${_starField} ${_labelField} ${_commentField} ${_fileField}`;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}
            ${_starJoin}
            ${_labelJoin}
            ${_commentJoin}
            ${_fileJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_starWhere}
             ${_labelWhere}
             ${_commentWhere}
             ${_fileWhere}
             and (
                     (a.userIdCreated=${userIdWho}) or
                     (
                           a.atomEnabled=1 and
                           (
                               (
                                 a.atomFlow=1 and
                                   (
                                     (
                                       exists(
                                               select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action>2 and c.userIdWho=${userIdWho}
                                             )
                                     ) or
                                     (
                                       a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=${userIdWho}
                                     )
                                   )
                                 )
                               )
                               or
                               (
                                 a.atomFlow=0 and
                                   (
                                     b.public=1 or
                                     exists(
                                             select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
                                           )
                                   )
                               )
                           )
                     )
                 )
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    getAtom({ iid, userIdWho, tableName, atomId }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);

      // vars
      let _starField,
        _labelField;
      let _itemField,
        _itemJoin;

      // star
      if (userIdWho) {
        _starField =
          `,(select d.star from aAtomStar d where d.iid=${iid} and d.atomId=a.id and d.userId=${userIdWho}) as star`;
      } else {
        _starField = '';
      }

      // label
      if (userIdWho) {
        _labelField =
          `,(select e.labels from aAtomLabel e where e.iid=${iid} and e.atomId=a.id and e.userId=${userIdWho}) as labels`;
      } else {
        _labelField = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // sql
      const _sql =
        `select ${_itemField}
                a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar
                ${_starField}
                ${_labelField}
          from aAtom a

            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}

          where a.id=${atomId}
            and a.deleted=0 and a.iid=${iid}
        `;

      // ok
      return _sql;
    }

    checkRightRead({ iid, userIdWho, atomId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      // sql
      const _sql =
        `select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where
             (
                 a.deleted=0 and a.iid=${iid} and a.id=${atomId}
                 and
                 (
                      (a.userIdCreated=${userIdWho})
                      or
                      (
                          a.atomEnabled=1 and
                          (
                              (
                                  a.atomFlow=1 and
                                  (
                                      (
                                        exists(
                                                select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action>2 and c.userIdWho=${userIdWho}
                                              )
                                      )
                                      or
                                      (
                                        a.userIdCreated=${userIdWho} and
                                        exists(
                                                select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=${userIdWho}
                                              )
                                      )
                                  )
                              )
                              or
                              (
                                  a.atomFlow=0 and
                                  (
                                      b.public=1 or
                                      exists(
                                              select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
                                            )
                                  )
                              )
                          )
                      )
                 )
             )
        `;
      return _sql;
    }

    checkRightUpdate({ iid, userIdWho, atomId, action, actionFlag }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);

      actionFlag = ctx.model.format('?', actionFlag);

      // sql
      const _sql =
        `select a.* from aAtom a
           where
           (
             a.deleted=0 and a.iid=${iid} and a.id=${atomId}
             and (
                  (a.atomEnabled=0 and a.userIdCreated=${userIdWho}) or
                  (a.atomEnabled=1 and (
                    (exists(select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.userIdWho=${userIdWho})) or
                    (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.scope=0 and c.userIdWho=${userIdWho}))
                  ))
                )
           )
        `;
      return _sql;
    }

    checkRightAction({ iid, userIdWho, atomId, action, actionFlag }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);

      actionFlag = ctx.model.format('?', actionFlag);

      // sql
      const _sql =
        `select a.* from aAtom a
            where
            (
               a.deleted=0 and a.iid=${iid} and a.id=${atomId} and a.atomEnabled=1
               and (
                      (exists(select c.atomId from aViewUserRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.userIdWho=${userIdWho})) or
                      (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.scope=0 and c.userIdWho=${userIdWho}))
                   )
            )
        `;
      return _sql;
    }

    checkRightCreate({ iid, userIdWho, atomClassId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);

      // sql
      const _sql =
        `select a.* from aAtomClass a
            inner join aViewUserRightAtomClass b on a.id=b.atomClassId
              where b.iid=${iid} and b.atomClassId=${atomClassId} and b.action=1 and b.userIdWho=${userIdWho}
        `;
      return _sql;
    }

    checkRightCreateRole({ iid, userIdWho, atomClassId, roleIdOwner }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      roleIdOwner = parseInt(roleIdOwner);

      // sql
      const _sql =
        `select a.* from aAtomClass a
            inner join aViewUserRightAtomClass b on a.id=b.atomClassId
              where b.iid=${iid} and b.atomClassId=${atomClassId} and b.action=1 and b.userIdWho=${userIdWho} and b.roleId=${roleIdOwner}
        `;
      return _sql;
    }

    selectFunctions({ iid, locale, userIdWho, where, orders, page, star }) {
      // -- tables
      // -- a: aFunction
      // -- b: aFunctionLocale
      // -- c: aViewUserRightFunction
      // -- d: aFunctionStar
      // -- e: aAtomClass
      // -- f: aFunctionScene

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);

      locale = locale ? ctx.model.format('?', locale) : null;

      // vars
      let _starField,
        _starJoin,
        _starWhere;
      let _localeField,
        _localeJoin,
        _localeWhere;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // star
      if (star) {
        _starField = '';
        _starJoin = ' inner join aFunctionStar d on a.id=d.functionId';
        _starWhere = ` and d.iid=${iid} and d.userId=${userIdWho} and d.star=1`;
      } else {
        _starField =
        `,(select d.star from aFunctionStar d where d.iid=${iid} and d.functionId=a.id and d.userId=${userIdWho}) as star`;
        _starJoin = '';
        _starWhere = '';
      }

      // locale
      if (locale) {
        _localeField = ',b.titleLocale';
        _localeJoin = ' inner join aFunctionLocale b on a.id=b.functionId';
        _localeWhere = ` and b.iid=${iid} and b.locale=${locale}`;
      } else {
        _localeField = '';
        _localeJoin = '';
        _localeWhere = '';
      }

      // sql
      const _sql =
        `select a.*,
                e.atomClassName,e.atomClassIdParent
                ${_localeField}
                ${_starField}
           from aFunction a

             left join aAtomClass e on a.atomClassId=e.id
             left join aFunctionScene f on a.sceneId=f.id
             ${_localeJoin}
             ${_starJoin}

             ${_where}

              (
                a.deleted=0 and a.iid=${iid}
                ${_localeWhere}
                ${_starWhere}
                and (
                       a.public=1
                       or
                       exists(
                               select c.functionId from aViewUserRightFunction c where c.iid=${iid} and a.id=c.functionId and c.userIdWho=${userIdWho}
                             )
                    )
              )

            ${_orders}
            ${_limit}
       `;

      // ok
      return _sql;
    }

    checkRightFunction({ iid, userIdWho, functionId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      functionId = parseInt(functionId);
      // sql
      const _sql =
        `select a.* from aFunction a
            where a.deleted=0 and a.iid=${iid} and a.id=${functionId}
              and ( a.public=1 or
                    exists(select c.functionId from aViewUserRightFunction c where c.iid=${iid} and c.functionId=${functionId} and c.userIdWho=${userIdWho})
                  )
        `;
      return _sql;
    }

    checkFunctionLocales({ iid, locale }) {
      // for safe
      iid = parseInt(iid);
      locale = ctx.model.format('?', locale);
      // sql
      const _sql =
        `select a.* from aFunction a
            where a.iid=${iid}
              and not exists(
                select b.id from aFunctionLocale b
                  where b.iid=${iid} and b.locale=${locale} and b.functionId=a.id
                    and (b.titleLocale is not null and b.titleLocale<>'')
                )
        `;
      return _sql;
    }

  }

  return Procedure;

};
