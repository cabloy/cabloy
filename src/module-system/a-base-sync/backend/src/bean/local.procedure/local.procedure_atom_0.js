module.exports = ctx => {
  class Procedure {
    async _selectAtoms_0({
      iid,
      atomClass,
      atomClassBase,
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
      atomIdMain,
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
      // -- m: aResourceLocale
      // -- p: aCmsArticle
      // -- q: aCmsContent

      // important
      if (!atomClass) {
        ctx.throw(403);
      }

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
      let _atomField, _atomJoin;

      let _resourceField, _resourceJoin;

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
        _commentField =
          ',h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName';
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

      // resource
      if (resource && resourceLocale) {
        _resourceField = ',m.atomNameLocale';
        _resourceJoin = ' inner join aResourceLocale m on m.atomId=a.id';
        _where['a.atomDisabled'] = 0;
        _where['m.locale'] = resourceLocale;
      } else {
        _resourceField = '';
        _resourceJoin = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        if (!atomClassBase || !atomClassBase.itemOnly) {
          _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
        } else {
          _itemJoin = `from ${tableName} f`;
        }
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // atom
      if (!atomClassBase || !atomClassBase.itemOnly) {
        _atomField = `a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
          a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,a.atomTags,
          a.atomSimple,a.atomDisabled,a.atomState,
          a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt`;
        _atomJoin = 'from aAtom a';
        _where['a.deleted'] = 0;
        _where['a.iid'] = iid;
        _where['a.atomStage'] = stage;
      } else {
        _atomField = 'f.id as atomId,f.id as itemId';
        _atomJoin = '';
        _where['f.deleted'] = 0;
        _where['f.iid'] = iid;
      }

      // atomClass inner
      if (!atomClass) {
        _where['a.atomClassId'] = await this._prepare_atomClassIdsInner();
      }
      if (atomClass && !atomClassBase.itemOnly) {
        _where['a.atomClassId'] = atomClass.id;
      }

      // atomIdMain
      if (atomClass && atomClassBase.detail) {
        if (atomIdMain) {
          const atomIdMainField = atomClassBase.detail.atomIdMain || 'atomIdMain';
          _where[`f.${atomIdMainField}`] = atomIdMain;
        }
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = this._combineFields([
          _itemField,
          _cmsField,
          _atomField,
          _commentField,
          _fileField,
          _resourceField,
        ]);
      }

      // _rightWhere
      const _rightWhere = await this._selectAtoms_0_rightWhere({
        iid,
        atomClass,
        atomClassBase,
        tableName,
        resource,
        resourceLocale,
        forAtomUser,
        role,
      });
      _where.__and__right = _rightWhere;

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
            ${_resourceJoin}
            ${_cmsJoin}

          ${_whereClause}

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    async _selectAtoms_0_rightWhere({ iid, forAtomUser, role }) {
      if (forAtomUser && role) {
        return ctx.model.raw(`
          exists(
            select c2.userId from aViewUserRoleRef c2 where c2.iid=${iid} and a.itemId=c2.userId and c2.roleIdParent=${role}
          )
        `);
      }
      return true;
    }
  }
  return Procedure;
};
