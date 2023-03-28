module.exports = ctx => {
  class Procedure {
    _prepare_cms({ tableName, iid, mode, cms }) {
      let _cmsField, _cmsJoin, _cmsWhere;

      // cms
      if (cms) {
        _cmsField = `${
          tableName ? '' : 'p.createdAt,p.updatedAt,'
        }p.sticky,p.keywords,p.description,p.summary,p.url,p.editMode,p.slug,p.sorting,p.flag,p.extra,p.imageCover,p.imageFirst,p.audioFirst,p.audioCoverFirst,p.uuid,p.renderAt,`;
        _cmsJoin = ' inner join aCmsArticle p on p.atomId=a.id';
        _cmsWhere = ` and p.iid=${iid} and p.deleted=0`;
        if (mode && mode !== 'default') {
          // full/search/others
          _cmsField += 'q.content,q.html,';
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

    async _prepare_atomClassIdsInner() {
      const __atomClassIds = await ctx.bean.atomClass.getAtomClassIdsInner({ inner: false });
      return ` and a.atomClassId in (${__atomClassIds.join(',')})`;
    }

    async _prepare_roleScopesOfUser({ atomClass, action, userIdWho }) {
      const roleScopes = await ctx.bean.atom.getRoleScopesOfUser({
        atomClass: { id: atomClass.id },
        action,
        userId: userIdWho,
      });
      return roleScopes;
    }
  }
  return Procedure;
};
