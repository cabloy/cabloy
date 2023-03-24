module.exports = ctx => {
  class Procedure {
    async _selectAtoms_formal({
      iid,
      userIdWho,
      atomClassId,
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
      mine,
      resource,
      resourceLocale,
      mode,
      cms,
      forAtomUser,
      role,
    }) {
      // -- tables
      // -- a: aAtom
      // -- c: aViewUserRightAtomClassRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g2: aUser
      // -- h: aComment
      // -- i: aFile
      // -- j: aCategory
      // -- k: aTagRef
      // -- m: aResourceLocale
      // -- p: aCmsArticle
      // -- q: aCmsContent

      // important
      if (!atomClassId && !star && !label && !mine) {
        ctx.throw(403);
      }

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

      let _resourceField, _resourceJoin, _resourceWhere;

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

      // resource
      if (resource && resourceLocale) {
        _resourceField = ',m.atomNameLocale';
        _resourceJoin = ' inner join aResourceLocale m on m.atomId=a.id';
        _resourceWhere = ctx.model.format(' and a.atomDisabled=0 and m.locale=?', resourceLocale);
      } else {
        _resourceField = '';
        _resourceJoin = '';
        _resourceWhere = '';
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
      if (atomClassId || star || label) {
        _atomClassWhere = '';
      } else {
        _atomClassWhere = await this._prepare_atomClassIdsInner();
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField} ${_cmsField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,
                a.atomSimple,a.atomDisabled,a.atomState,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_starField} ${_labelField} ${_commentField} ${_fileField} ${_resourceField}`;
      }

      // _rightWhere: false/empty/clause
      let _rightWhere = await this._selectAtoms_formal_rightWhere({
        iid,
        userIdWho,
        atomClassId,
        tableName,
        star,
        label,
        mine,
        resource,
        resourceLocale,
        forAtomUser,
        role,
      });
      if (_rightWhere === false) return false;
      if (_rightWhere) {
        _rightWhere = ` and ( ${_rightWhere} )`;
      }

      // sql
      const _sql = `select ${_selectFields} from aAtom a
            left join aUser g2 on a.userIdUpdated=g2.id
            left join aCategory j on a.atomCategoryId=j.id
            ${_itemJoin}
            ${_tagJoin}
            ${_starJoin}
            ${_labelJoin}
            ${_commentJoin}
            ${_fileJoin}
            ${_resourceJoin}
            ${_cmsJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid} and a.atomStage=${stage}
             ${_atomClassWhere}
             ${_languageWhere}
             ${_categoryWhere}
             ${_tagWhere}
             ${_starWhere}
             ${_labelWhere}
             ${_commentWhere}
             ${_fileWhere}
             ${_resourceWhere}
             ${_cmsWhere}
             ${_rightWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    async _selectAtoms_formal_rightWhere({
      iid,
      userIdWho,
      atomClassId,
      tableName,
      star,
      label,
      mine,
      resource,
      resourceLocale,
      forAtomUser,
      role,
    }) {
      // pass through for star/label
      if (star || label) return '';

      // resource
      if (resource) {
        // _itemKeyName
        let _itemKeyName;
        if (resource && resourceLocale) {
          _itemKeyName = 'm.atomId';
        } else if (tableName) {
          _itemKeyName = 'f.atomId';
        } else {
          _itemKeyName = 'a.id';
        }
        return `
          exists(
            select c.resourceAtomId from aViewUserRightResource c where c.iid=${iid} and ${_itemKeyName}=c.resourceAtomId and c.userIdWho=${userIdWho}
          )
        `;
      }

      // mine
      const _mine = `
        (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=2 and c.scope=0 and c.userIdWho=${userIdWho}))
      `;
      if (mine) {
        return _mine;
      }

      // others
      let _others;
      if (forAtomUser) {
        if (role) {
          // get users of role
          _others = `
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c
                  inner join aViewUserRoleRef c2 on c.userIdWhom=c2.userId and c2.roleIdParent=${role}
                  where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.userIdWho=${userIdWho}
              )
            `;
        } else {
          _others = `
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.atomClassId=a.atomClassId and c.action=2 and c.userIdWho=${userIdWho}
              )
            `;
        }
      } else {
        const roleScopes = await this._prepare_roleScopesOfUser({ atomClassId, action: 2, userIdWho });
        if (roleScopes === true) return ''; // pass through
        if (roleScopes === false) {
          _others = ''; // should check mine
        } else {
          _others = `
            a.roleIdOwner in (${roleScopes.join(',')})
          `;
        }
      }
      //
      let _rightWhere;
      if (!_others) {
        _rightWhere = _mine;
      } else {
        // _rightWhere = _others;
        _rightWhere = `
            (
              ${_mine}
              or
              ${_others}
            )
          `;
      }
      // ok
      return _rightWhere;
    }
  }
  return Procedure;
};
