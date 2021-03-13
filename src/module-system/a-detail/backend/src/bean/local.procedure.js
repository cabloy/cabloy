module.exports = ctx => {
  class Procedure {

    selectDetails({ iid, tableName, where, orders, page, count, stage }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser

      iid = parseInt(iid);
      stage = parseInt(stage);

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _itemField,
        _itemJoin;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.detailId=a.id`;
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
                a.id as detailId,a.atomId,a.atomStage,a.detailItemId,a.detailClassId,
                a.detailCodeId,a.detailCode,a.detailName,a.detailLineNo,
                a.userIdCreated,a.userIdUpdated,a.createdAt as detailCreatedAt,a.updatedAt as detailUpdatedAt,
                b.module,b.detailClassName,
                g.userName,g.avatar,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
                `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aDetail a
            inner join aDetailClass b on a.detailClassId=b.id
            left join aUser g on a.userIdCreated=g.id
            left join aUser g2 on a.userIdUpdated=g2.id
            ${_itemJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid} and a.atomStage=${stage}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    getDetail({ iid, tableName, detailId }) {
      // -- tables
      // -- a: aDetail
      // -- b: aDetailClass
      // -- f: {item}
      // -- g: aUser
      // -- g2: aUser

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;

      iid = parseInt(iid);
      detailId = parseInt(detailId);

      // vars
      let _itemField,
        _itemJoin;

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.detailId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // sql
      const _sql =
        `select ${_itemField}
                a.id as detailId,a.atomId,a.atomStage,a.detailItemId,a.detailClassId,
                a.detailCodeId,a.detailCode,a.detailName,a.detailLineNo,
                a.userIdCreated,a.userIdUpdated,a.createdAt as detailCreatedAt,a.updatedAt as detailUpdatedAt,
                b.module,b.detailClassName,
                g.userName,g.avatar,
                g2.userName as userNameUpdated,g2.avatar as avatarUpdated
          from aDetail a

            inner join aDetailClass b on a.detailClassId=b.id
            left join aUser g on a.userIdCreated=g.id
            left join aUser g2 on a.userIdUpdated=g2.id
            ${_itemJoin}

          where a.id=${detailId}
            and a.deleted=0 and a.iid=${iid}
        `;

      // ok
      return _sql;
    }

  }

  return Procedure;

};
