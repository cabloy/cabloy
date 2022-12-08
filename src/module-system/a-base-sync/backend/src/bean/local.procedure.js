const procedure_atom = require('./local.procedure/local.procedure_atom.js');
const procedure_atom_0 = require('./local.procedure/local.procedure_atom_0.js');
const procedure_atom_draft = require('./local.procedure/local.procedure_atom_draft.js');
const procedure_atom_formal = require('./local.procedure/local.procedure_atom_formal.js');
const procedure_atom_getAtom = require('./local.procedure/local.procedure_atom_getAtom.js');
const procedure_atomRight = require('./local.procedure/local.procedure_atomRight.js');
const procedure_resource = require('./local.procedure/local.procedure_resource.js');

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    procedure_atom,
    [
      procedure_atom_0,
      procedure_atom_draft,
      procedure_atom_formal,
      procedure_atom_getAtom,
      procedure_atomRight,
      procedure_resource,
    ],
    ctx
  );
};

// /* backup */

// selectUsers({ iid, where, orders, page, count, fields }) {
//   // -- tables
//   // -- a: aUser

//   // for safe
//   where = where ? ctx.model._where(where) : null;
//   orders = orders ? ctx.model._orders(orders) : null;
//   const limit = page ? ctx.model._limit(page.size, page.index) : null;

//   // vars

//   //
//   const _where = where ? `${where} AND` : ' WHERE';
//   const _orders = orders || '';
//   const _limit = limit || '';

//   // fields
//   let _selectFields;
//   if (count) {
//     _selectFields = 'count(*) as _count';
//   } else {
//     _selectFields = fields;
//   }

//   // sql
//   const _sql = `select ${_selectFields} from aUser a
//       ${_where}
//        (
//          a.deleted=0 and a.iid=${iid}
//        )

//       ${count ? '' : _orders}
//       ${count ? '' : _limit}
//     `;

//   // ok
//   return _sql;
// }

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
