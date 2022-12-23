module.exports = ctx => {
  class Procedure {
    checkRightResource({ iid, userIdWho, resourceAtomId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho || 0);
      resourceAtomId = parseInt(resourceAtomId);
      // _rightWhere
      let _rightWhere = '';
      if (userIdWho) {
        _rightWhere = `
          and (
            exists(select c.resourceAtomId from aViewUserRightResource c where c.iid=${iid} and c.resourceAtomId=${resourceAtomId} and c.userIdWho=${userIdWho})
              )
        `;
      }
      // sql
      const _sql = `select a.id as atomId,a.atomName from aAtom a
            where a.iid=${iid} and a.deleted=0 and a.atomDisabled=0 and a.atomStage=1 and a.id=${resourceAtomId}
              ${_rightWhere}
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
  }
  return Procedure;
};
