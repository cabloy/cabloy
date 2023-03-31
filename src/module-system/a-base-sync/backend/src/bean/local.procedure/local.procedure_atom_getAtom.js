module.exports = ctx => {
  class Procedure {
    async getAtom({
      iid,
      userIdWho,
      // atomClass,
      atomClassBase,
      tableName,
      atomId,
      resource,
      resourceLocale,
      mode,
      cms /* , forAtomUser*/,
    }) {
      // -- tables
      // -- a: aAtom
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- m: aResourceLocale
      // -- p: aCmsArticle
      // -- q: aCmsContent

      // for safe
      // tableName = tableName ? ctx.model.format('??', tableName) : null; // not format tableName

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      resource = parseInt(resource);

      // where
      const _where = {};

      // vars
      let _starField, _labelField;
      let _itemField, _itemJoin;
      let _atomField, _atomJoin;

      let _resourceField, _resourceJoin;

      // cms
      const { _cmsField, _cmsJoin, _cmsWhere } = this._prepare_cms({ tableName, iid, mode, cms });
      _where.__and__cms = _cmsWhere;

      // star
      if (userIdWho && !atomClassBase.itemOnly) {
        _starField = `,(select d.star from aAtomStar d where d.iid=${iid} and d.atomId=a.id and d.userId=${userIdWho}) as star`;
      } else {
        _starField = '';
      }

      // label
      if (userIdWho && !atomClassBase.itemOnly) {
        _labelField = `,(select e.labels from aAtomLabel e where e.iid=${iid} and e.atomId=a.id and e.userId=${userIdWho}) as labels`;
      } else {
        _labelField = '';
      }

      // resource
      if (resource && resourceLocale) {
        _resourceField = ',m.atomNameLocale';
        _resourceJoin = ' inner join aResourceLocale m on m.atomId=a.id';
        // not check atomDisabled
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
      if (!atomClassBase.itemOnly) {
        _atomField = `a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
          a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,a.atomTags,
          a.atomSimple,a.atomDisabled,a.atomState,
          a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt`;
        _atomJoin = 'from aAtom a';
        _where['a.id'] = atomId;
        _where['a.deleted'] = 0;
        _where['a.iid'] = iid;
      } else {
        _atomField = '';
        _atomJoin = '';
        _where['f.id'] = atomId;
        _where['f.deleted'] = 0;
        _where['f.iid'] = iid;
      }

      // fields
      const _selectFields = this._combineFields([
        _itemField,
        _cmsField,
        _atomField,
        _starField,
        _labelField,
        _resourceField,
      ]);

      // where clause
      let _whereClause = ctx.model._formatWhere(_where);
      if (_whereClause === false) return false;
      _whereClause = _whereClause === true ? '' : ` WHERE (${_whereClause})`;

      // sql
      const _sql = `select ${_selectFields} ${_atomJoin}
            ${_itemJoin}
            ${_resourceJoin}
            ${_cmsJoin}

          ${_whereClause}
        `;

      // ok
      return _sql;
    }
  }
  return Procedure;
};
