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
  }
  return Procedure;
};
