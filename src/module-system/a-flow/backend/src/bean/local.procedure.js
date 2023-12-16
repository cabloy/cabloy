module.exports = class Procedure {
  // mode: mine/others/flowing/history
  selectFlows({ iid, userIdWho, where, orders, page, count, mode }) {
    iid = parseInt(iid);
    userIdWho = parseInt(userIdWho);

    // mode
    if (mode === 'mine') {
      return this._selectFlows_Mine({ iid, userIdWho, where, orders, page, count });
    } else if (mode === 'others' || mode === 'flowing') {
      return this._selectFlows_Others({ iid, userIdWho, where, orders, page, count, mode });
    }
    return this._selectFlows_History({ iid, userIdWho, where, orders, page, count });
  }

  _selectFlows_Mine({ iid, userIdWho, where, orders, page, count }) {
    // -- tables
    // -- a: aFlow
    // -- c: aUser

    // for safe
    where = where ? this.ctx.model._where(where) : null;
    orders = orders ? this.ctx.model._orders(orders) : null;
    const limit = page ? this.ctx.model._limit(page.size, page.index) : null;

    // vars
    let _userWhere;

    //
    const _where = where ? `${where} AND` : ' WHERE';
    const _orders = orders || '';
    const _limit = limit || '';

    // user
    if (userIdWho !== 0) {
      _userWhere = ` and a.flowUserId=${userIdWho}`;
    } else {
      _userWhere = '';
    }

    // fields
    let _selectFields;
    if (count) {
      _selectFields = 'count(*) as _count';
    } else {
      _selectFields = `a.id,a.id as flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowAtomClassId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,
            c.userName,c.avatar
          `;
    }

    // sql
    const _sql = `select ${_selectFields} from aFlow a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

    // ok
    return _sql;
  }

  _selectFlows_Others({ iid, userIdWho, where, orders, page, count, mode }) {
    // -- tables
    // -- a: aFlow
    // -- c: aUser
    // -- d: aFlowTaskHistory

    // for safe
    where = where ? this.ctx.model._where(where) : null;
    orders = orders ? this.ctx.model._orders(orders) : null;
    const limit = page ? this.ctx.model._limit(page.size, page.index) : null;

    // vars
    let _userWhere;
    let _modeWhere;

    //
    const _where = where ? `${where} AND` : ' WHERE';
    const _orders = orders || '';
    const _limit = limit || '';

    // user
    if (userIdWho !== 0) {
      _userWhere = ` and exists(select d.id from aFlowTaskHistory d where d.deleted=0 and d.flowId=a.id and d.userIdAssignee=${userIdWho})`;
    } else {
      _userWhere = '';
    }

    // mode
    if (mode === 'others') {
      _modeWhere = ` and a.flowUserId<>${userIdWho}`;
    } else {
      _modeWhere = '';
    }

    // fields
    let _selectFields;
    if (count) {
      _selectFields = 'count(*) as _count';
    } else {
      _selectFields = `a.id,a.id as flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowAtomClassId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,
            c.userName,c.avatar
          `;
    }

    // sql
    const _sql = `select ${_selectFields} from aFlow a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
             ${_modeWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

    // ok
    return _sql;
  }

  _selectFlows_History({ iid, userIdWho, where, orders, page, count }) {
    // -- tables
    // -- a: aFlowHistory
    // -- c: aUser
    // -- d: aFlowTaskHistory

    // for safe
    where = where ? this.ctx.model._where(where) : null;
    orders = orders ? this.ctx.model._orders(orders) : null;
    const limit = page ? this.ctx.model._limit(page.size, page.index) : null;

    // vars
    let _userWhere;

    //
    const _where = where ? `${where} AND` : ' WHERE';
    const _orders = orders || '';
    const _limit = limit || '';

    // user
    if (userIdWho !== 0) {
      _userWhere = ` and exists(select d.id from aFlowTaskHistory d where d.deleted=0 and d.flowId=a.flowId and d.userIdAssignee=${userIdWho})`;
    } else {
      _userWhere = '';
    }

    // fields
    let _selectFields;
    if (count) {
      _selectFields = 'count(*) as _count';
    } else {
      _selectFields = `a.id,a.flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowAtomClassId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,a.timeEnd,a.flowHandleStatus,a.flowRemark,
            c.userName,c.avatar
          `;
    }

    // sql
    const _sql = `select ${_selectFields} from aFlowHistory a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

    // ok
    return _sql;
  }
};
