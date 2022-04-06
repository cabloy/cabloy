module.exports = ctx => {
  class Procedure {
    selectAtoms({
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
      mine,
      resource,
      resourceLocale,
      mode,
      cms,
      forAtomUser,
      role,
    }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);
      label = parseInt(label);
      comment = parseInt(comment);
      file = parseInt(file);
      stage = parseInt(stage);
      category = parseInt(category);
      tag = parseInt(tag);
      mine = parseInt(mine);
      resource = parseInt(resource);
      role = parseInt(role);

      // draft
      if (stage === 0) {
        // userIdWho must be set
        return this._selectAtoms_draft({
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
        });
      }
      if (userIdWho === 0) {
        return this._selectAtoms_0({
          iid,
          tableName,
          where,
          orders,
          page,
          comment,
          file,
          count,
          stage,
          language,
          category,
          tag,
          resource,
          resourceLocale,
          mode,
          cms,
          forAtomUser,
          role,
        });
      }
      // formal/history
      return this._selectAtoms({
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
        mine,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
        role,
      });
    }

    _prepare_cms({ tableName, iid, mode, cms }) {
      let _cmsField, _cmsJoin, _cmsWhere;

      // cms
      if (cms) {
        _cmsField = `,${
          tableName ? '' : 'p.createdAt,p.updatedAt,'
        }p.sticky,p.keywords,p.description,p.summary,p.url,p.editMode,p.slug,p.sorting,p.flag,p.extra,p.imageCover,p.imageFirst,p.audioFirst,p.audioCoverFirst,p.uuid,p.renderAt`;
        _cmsJoin = ' inner join aCmsArticle p on p.atomId=a.id';
        _cmsWhere = ` and p.iid=${iid} and p.deleted=0`;
        if (mode && mode !== 'default') {
          // full/search/others
          _cmsField += ',q.content,q.html';
          _cmsJoin += ' inner join aCmsContent q on q.atomId=a.id';
          _cmsWhere += ` and q.iid=${iid} and q.deleted=0`;
        }
      } else {
        _cmsField = '';
        _cmsJoin = '';
        _cmsWhere = '';
      }

      return { _cmsField, _cmsJoin, _cmsWhere };
    }

    _selectAtoms_draft({
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
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser
      // -- h: aComment
      // -- i: aFile
      // -- j: aCategory
      // -- k: aTagRef
      // -- p: aCmsArticle
      // -- q: aCmsContent
      // -- r: aFlow

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

      // flow
      const _flowField = ',r.flowStatus,r.flowNodeIdCurrent,r.flowNodeNameCurrent';
      const _flowJoin = ' left join aFlow r on r.id=a.atomFlowId';
      const _flowWhere = '';

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // atomClassInner
      // eslint-disable-next-line
      _atomClassWhere = '';
      // if (tableName || star || label) {
      //   _atomClassWhere = '';
      // } else {
      //   _atomClassWhere = ' and b.atomClassInner=0';
      // }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,a.atomSimple,a.atomDisabled,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_starField} ${_labelField} ${_commentField}
                ${_fileField} ${_flowField}
                ${_cmsField}
              `;
      }

      // sql
      const _sql = `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            left join aUser g on a.userIdCreated=g.id
            left join aUser g2 on a.userIdUpdated=g2.id
            left join aCategory j on a.atomCategoryId=j.id
            ${_itemJoin}
            ${_tagJoin}
            ${_starJoin}
            ${_labelJoin}
            ${_commentJoin}
            ${_fileJoin}
            ${_flowJoin}
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
             ${_flowWhere}
             ${_cmsWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    _selectAtoms_0({
      iid,
      tableName,
      where,
      orders,
      page,
      comment,
      file,
      count,
      stage,
      language,
      category,
      tag,
      resource,
      resourceLocale,
      mode,
      cms,
      forAtomUser,
      role,
    }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser
      // -- h: aComment
      // -- i: aFile
      // -- j: aCategory
      // -- k: aTagRef
      // -- m: aResourceLocale
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

      let _commentField, _commentJoin, _commentWhere;
      let _fileField, _fileJoin, _fileWhere;
      let _itemField, _itemJoin;

      let _atomClassWhere;

      let _resourceField, _resourceJoin, _resourceWhere;

      let _userField, _userJoin;

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
        _resourceJoin = ' left join aResourceLocale m on m.atomId=a.id';
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

      // atomClassInner
      // atomClassInner
      if (tableName) {
        _atomClassWhere = '';
      } else {
        _atomClassWhere = ' and b.atomClassInner=0';
      }

      // aUser
      if (forAtomUser) {
        _userField = '';
        _userJoin = '';
      } else {
        _userField = 'g.userName,g.avatar,';
        _userJoin = ' left join aUser g on a.userIdCreated=g.id';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,a.atomSimple,a.atomDisabled,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                ${_userField}
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_commentField} ${_fileField} ${_resourceField} ${_cmsField}`;
      }

      // sql
      const _sql = `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            ${_userJoin}
            left join aUser g2 on a.userIdUpdated=g2.id
            left join aCategory j on a.atomCategoryId=j.id
            ${_itemJoin}
            ${_tagJoin}
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
             ${_commentWhere}
             ${_fileWhere}
             ${_resourceWhere}
             ${_cmsWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    _selectAtoms({
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
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser
      // -- h: aComment
      // -- i: aFile
      // -- j: aCategory
      // -- k: aTagRef
      // -- m: aResourceLocale
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

      let _resourceField, _resourceJoin, _resourceWhere;

      let _userField, _userJoin;

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
        _resourceJoin = ' left join aResourceLocale m on m.atomId=a.id';
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

      // atomClassInner
      if (tableName || star || label) {
        _atomClassWhere = '';
      } else {
        _atomClassWhere = ' and b.atomClassInner=0';
      }

      // aUser
      if (forAtomUser) {
        _userField = '';
        _userJoin = '';
      } else {
        _userField = 'g.userName,g.avatar,';
        _userJoin = ' left join aUser g on a.userIdCreated=g.id';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `${_itemField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,a.atomSimple,a.atomDisabled,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                ${_userField}
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_starField} ${_labelField} ${_commentField} ${_fileField} ${_resourceField} ${_cmsField}`;
      }

      // mine
      let _rightWhere;
      if (resource) {
        _rightWhere = `
          exists(
            select c.resourceAtomId from aViewUserRightResource c where c.iid=${iid} and a.id=c.resourceAtomId and c.userIdWho=${userIdWho}
          )
        `;
      } else {
        const _mine = `
          (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=2 and c.scope=0 and c.userIdWho=${userIdWho}))
        `;
        let _others;
        if (forAtomUser) {
          if (role) {
            _others = `
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c
                  inner join aViewUserRoleRef c2 on c.userIdWhom=c2.userId and c2.roleIdParent=${role}
                  where c.iid=${iid} and a.itemId=c.userIdWhom and c.action=2 and c.userIdWho=${userIdWho}
              )
            `;
          } else {
            _others = `
              exists(
                select c.userIdWhom from aViewUserRightAtomClassUser c where c.iid=${iid} and a.itemId=c.userIdWhom and c.action=2 and c.userIdWho=${userIdWho}
              )
            `;
          }
        } else {
          _others = `
            exists(
              select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
            )
          `;
        }
        //
        if (mine) {
          _rightWhere = _mine;
        } else if (star || label) {
          _rightWhere = `
            (
              ${_mine}
              or
              ${_others}
            )
          `;
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
      }

      // sql
      const _sql = `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            ${_userJoin}
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
             and ( ${_rightWhere} )
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    getAtom({ iid, userIdWho, tableName, atomId, resource, resourceLocale, mode, cms, forAtomUser }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser
      // -- j: aCategory
      // -- m: aResourceLocale
      // -- p: aCmsArticle
      // -- q: aCmsContent
      // -- r: aFlow

      // for safe
      // tableName = tableName ? ctx.model.format('??', tableName) : null; // not format tableName

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      resource = parseInt(resource);

      // vars
      let _starField, _labelField;
      let _itemField, _itemJoin;

      let _resourceField, _resourceJoin, _resourceWhere;

      let _userField, _userJoin;

      // star
      if (userIdWho) {
        _starField = `,(select d.star from aAtomStar d where d.iid=${iid} and d.atomId=a.id and d.userId=${userIdWho}) as star`;
      } else {
        _starField = '';
      }

      // label
      if (userIdWho) {
        _labelField = `,(select e.labels from aAtomLabel e where e.iid=${iid} and e.atomId=a.id and e.userId=${userIdWho}) as labels`;
      } else {
        _labelField = '';
      }

      // resource
      if (resource && resourceLocale) {
        _resourceField = ',m.atomNameLocale';
        _resourceJoin = ' left join aResourceLocale m on m.atomId=a.id';
        // not check atomDisabled
        _resourceWhere = ctx.model.format(' and m.locale=?', resourceLocale);
      } else {
        _resourceField = '';
        _resourceJoin = '';
        _resourceWhere = '';
      }

      // flow
      const _flowField = ',r.flowStatus,r.flowNodeIdCurrent,r.flowNodeNameCurrent';
      const _flowJoin = ' left join aFlow r on r.id=a.atomFlowId';
      const _flowWhere = '';

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // cms
      const { _cmsField, _cmsJoin, _cmsWhere } = this._prepare_cms({ tableName, iid, mode, cms });

      // aUser
      if (forAtomUser) {
        _userField = '';
        _userJoin = '';
      } else {
        _userField = 'g.userName,g.avatar,';
        _userJoin = ' left join aUser g on a.userIdCreated=g.id';
      }

      // sql
      const _sql = `select ${_itemField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,a.atomSimple,a.atomDisabled,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                ${_userField}
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_starField}
                ${_labelField}
                ${_resourceField}
                ${_flowField}
                ${_cmsField}
          from aAtom a

            inner join aAtomClass b on a.atomClassId=b.id
            ${_userJoin}
            left join aUser g2 on a.userIdUpdated=g2.id
            left join aCategory j on a.atomCategoryId=j.id
            ${_itemJoin}
            ${_resourceJoin}
            ${_flowJoin}
            ${_cmsJoin}

          where a.id=${atomId}
            and a.deleted=0 and a.iid=${iid}
            ${_resourceWhere}
            ${_flowWhere}
            ${_cmsWhere}
        `;

      // ok
      return _sql;
    }

    checkRoleRightRead({ iid, roleIdWho, atomId }) {
      // for safe
      iid = parseInt(iid);
      roleIdWho = parseInt(roleIdWho);
      atomId = parseInt(atomId);
      // sql
      const _sql = `select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
            where
            (
               a.deleted=0 and a.iid=${iid} and a.id=${atomId}
               and a.atomStage>0 and
                (
                  exists(
                          select c.atomId from aViewRoleRightAtom c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.roleIdWho=${roleIdWho}
                        )
                )
            )
        `;
      return _sql;
    }

    // check for formal/history
    checkRightRead({ iid, userIdWho, atomId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      // sql
      const _sql = `select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where
             (
                 a.deleted=0 and a.iid=${iid} and a.id=${atomId}
                 and a.atomStage>0 and
                  (
                    exists(
                            select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
                          )
                      or
                   (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=2 and c.scope=0 and c.userIdWho=${userIdWho}))
                  )
             )
        `;
      return _sql;
    }

    checkRightAction({ iid, userIdWho, atomId, action }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);

      // sql
      const _sql = `select a.* from aAtom a
            where
            (
              a.deleted=0 and a.iid=${iid} and a.id=${atomId}
              and a.atomStage>0 and
                (
                  (exists(select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=${action} and c.userIdWho=${userIdWho})) or
                  (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and c.scope=0 and c.userIdWho=${userIdWho}))
                )
            )
        `;
      return _sql;
    }

    checkRightActionBulk({ iid, userIdWho, atomClassId, action }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      action = parseInt(action || 0);

      const _actionWhere = action ? `and a.code=${action}` : '';
      const _rightWhere = `
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.atomClassId=b.atomClassId and a.code=b.action and b.userIdWho=${userIdWho}
        )
      `;
      // sql
      const _sql = `select a.*,c.module,c.atomClassName,c.atomClassIdParent from aAtomAction a
            left join aAtomClass c on a.atomClassId=c.id
              where a.iid=${iid} and a.bulk=1 and a.atomClassId=${atomClassId} ${_actionWhere} ${_rightWhere}
        `;
      return _sql;
    }

    checkRightCreateRole({ iid, userIdWho, atomClassId, roleIdOwner }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      roleIdOwner = parseInt(roleIdOwner);

      const _rightWhere = `
        and exists(
          select b.atomClassId from aViewUserRightAtomClass b where b.iid=${iid} and a.id=b.atomClassId and b.action=1 and b.userIdWho=${userIdWho} and b.roleId=${roleIdOwner}
        )
      `;
      // sql
      const _sql = `select a.* from aAtomClass a
            where a.iid=${iid} and a.id=${atomClassId} ${_rightWhere}
        `;
      return _sql;
    }

    checkRightResource({ iid, userIdWho, resourceAtomId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      resourceAtomId = parseInt(resourceAtomId);
      // sql
      const _sql = `select a.id as atomId,a.atomName from aAtom a
            where a.iid=${iid} and a.deleted=0 and a.atomDisabled=0 and a.atomStage=1 and a.id=${resourceAtomId}
              and (
                exists(select c.resourceAtomId from aViewUserRightResource c where c.iid=${iid} and c.resourceAtomId=${resourceAtomId} and c.userIdWho=${userIdWho})
                  )
        `;
      return _sql;
    }

    _checkResourceLocales({ iid, locale, atomClassIds }) {
      // for safe
      iid = parseInt(iid);
      locale = ctx.model.format('?', locale);
      // sql
      const _sql = `select a.id as atomId,a.atomName from aAtom a
            where a.iid=${iid} and a.deleted=0 and a.atomStage=1 and a.atomClassId in (${atomClassIds.join(',')})
              and not exists(
                select b.id from aResourceLocale b
                  where b.iid=${iid} and b.locale=${locale} and b.atomId=a.id
                    and (b.atomNameLocale is not null and b.atomNameLocale<>'')
                )
        `;
      return _sql;
    }

    selectUsers({ iid, where, orders, page, count, fields }) {
      // -- tables
      // -- a: aUser

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = fields;
      }

      // sql
      const _sql = `select ${_selectFields} from aUser a
          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
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

// /* backup */

// function selectFunctions({ iid, locale, userIdWho, where, orders, page, star }) {
//   // -- tables
//   // -- a: aFunction
//   // -- b: aFunctionLocale
//   // -- c: aViewUserRightFunction
//   // -- d: aFunctionStar
//   // -- e: aAtomClass
//   // -- f: aFunctionScene

//   // for safe
//   where = where ? ctx.model._where(where) : null;
//   orders = orders ? ctx.model._orders(orders) : null;
//   const limit = page ? ctx.model._limit(page.size, page.index) : null;

//   iid = parseInt(iid);
//   userIdWho = parseInt(userIdWho);
//   star = parseInt(star);

//   locale = locale ? ctx.model.format('?', locale) : null;

//   // vars
//   let _starField,
//     _starJoin,
//     _starWhere;
//   let _localeField,
//     _localeJoin,
//     _localeWhere;

//   //
//   const _where = where ? `${where} AND` : ' WHERE';
//   const _orders = orders || '';
//   const _limit = limit || '';

//   // star
//   if (star) {
//     _starField = '';
//     _starJoin = ' inner join aFunctionStar d on a.id=d.functionId';
//     _starWhere = ` and d.iid=${iid} and d.userId=${userIdWho} and d.star=1`;
//   } else {
//     _starField =
//         `,(select d.star from aFunctionStar d where d.iid=${iid} and d.functionId=a.id and d.userId=${userIdWho}) as star`;
//     _starJoin = '';
//     _starWhere = '';
//   }

//   // locale
//   if (locale) {
//     _localeField = ',b.titleLocale';
//     _localeJoin = ' inner join aFunctionLocale b on a.id=b.functionId';
//     _localeWhere = ` and b.iid=${iid} and b.locale=${locale}`;
//   } else {
//     _localeField = '';
//     _localeJoin = '';
//     _localeWhere = '';
//   }

//   // sql
//   const _sql =
//         `select a.*,
//                 e.atomClassName,e.atomClassIdParent
//                 ${_localeField}
//                 ${_starField}
//            from aFunction a

//              left join aAtomClass e on a.atomClassId=e.id
//              left join aFunctionScene f on a.sceneId=f.id
//              ${_localeJoin}
//              ${_starJoin}

//              ${_where}

//               (
//                 a.deleted=0 and a.iid=${iid}
//                 ${_localeWhere}
//                 ${_starWhere}
//                 and (
//                        a.public=1
//                        or
//                        exists(
//                                select c.functionId from aViewUserRightFunction c where c.iid=${iid} and a.id=c.functionId and c.userIdWho=${userIdWho}
//                              )
//                     )
//               )

//             ${_orders}
//             ${_limit}
//        `;

//   // ok
//   return _sql;
// }

// function checkRightFunction({ iid, userIdWho, functionId }) {
//   // for safe
//   iid = parseInt(iid);
//   userIdWho = parseInt(userIdWho);
//   functionId = parseInt(functionId);
//   // sql
//   const _sql =
//         `select a.* from aFunction a
//             where a.deleted=0 and a.iid=${iid} and a.id=${functionId}
//               and ( a.public=1 or
//                     exists(select c.functionId from aViewUserRightFunction c where c.iid=${iid} and c.functionId=${functionId} and c.userIdWho=${userIdWho})
//                   )
//         `;
//   return _sql;
// }
