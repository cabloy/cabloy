module.exports = ctx => {
  class Procedure {
    async getAtom({ iid, userIdWho, tableName, atomId, resource, resourceLocale, mode, cms, forAtomUser }) {
      // -- tables
      // -- a: aAtom
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
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
        _resourceJoin = ' inner join aResourceLocale m on m.atomId=a.id';
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

      // sql
      const _sql = `select ${_itemField} ${_cmsField}
                a.id as atomId,a.itemId,a.atomStage,a.atomFlowId,a.atomClosed,a.atomIdDraft,a.atomIdFormal,a.roleIdOwner,a.atomClassId,a.atomName,
                a.atomStatic,a.atomStaticKey,a.atomRevision,a.atomLanguage,a.atomCategoryId,j.categoryName as atomCategoryName,a.atomTags,
                a.atomSimple,a.atomDisabled,a.atomState,
                a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                ${_starField}
                ${_labelField}
                ${_resourceField}
                ${_flowField}
          from aAtom a
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
  }
  return Procedure;
};
