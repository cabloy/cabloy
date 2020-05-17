module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 24);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("require3");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
  systemRoles: [ 'root', 'anonymous', 'authenticated', 'template', 'system', 'registered', 'activated', 'superuser', 'organization', 'internal', 'external' ],
  atom: {
    action: {
      create: 1,
      read: 2,
      write: 3,
      delete: 4,
      save: 51,
      submit: 52,
      custom: 100, // custom action start from custom
    },
    actionMeta: {
      create: { title: 'Create', actionComponent: 'action' },
      read: { title: 'View', actionPath: 'atom/view?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&module={{module}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      write: { title: 'Edit', actionPath: 'atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&module={{module}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}' },
      delete: { title: 'Delete', actionComponent: 'action' },
      save: { title: 'Save', actionComponent: 'action', authorize: false },
      submit: { title: 'Submit', actionComponent: 'action', authorize: false },
      custom: { title: 'Custom' },
    },
    orders: [
      { name: 'createdAt', title: 'Created Time', by: 'desc', tableAlias: 'a' },
      { name: 'updatedAt', title: 'Modification Time', by: 'desc', tableAlias: 'a' },
      { name: 'atomFlag', title: 'Atom Flag', by: 'asc', tableAlias: 'a' },
      { name: 'atomName', title: 'Atom Name', by: 'asc', tableAlias: 'a' },
    ],
  },
  function: {
    scene: {
      // default: 0,
      create: 1,
      list: 2,
      // report: 20,
      tools: 50,
      // custom: 100,
    },
  },
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = app => {

  class Function extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunction', options: { disableDeleted: true } });
    }

  }

  return Function;
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClass extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomClass', options: { disableDeleted: false } });
    }

  }

  return AtomClass;
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomAction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomAction', options: { disableDeleted: false } });
    }

  }

  return AtomAction;
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = app => {

  class Atom extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtom', options: { disableDeleted: false } });
    }

  }

  return Atom;
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomStar', options: { disableDeleted: true } });
    }

  }

  return AtomStar;
};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomLabel extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabel', options: { disableDeleted: true } });
    }

  }

  return AtomLabel;
};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomLabelRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAtomLabelRef', options: { disableDeleted: true } });
    }

  }

  return AtomLabelRef;
};


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = ctx => {
  class Procedure {

    selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);
      label = parseInt(label);
      comment = parseInt(comment);
      file = parseInt(file);

      if (userIdWho === 0) return this._selectAtoms_0({ iid, tableName, where, orders, page, comment, file, count });
      return this._selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count });
    }

    _selectAtoms_0({ iid, tableName, where, orders, page, comment, file, count }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- h: aComment
      // -- i: aFile

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _commentField,
        _commentJoin,
        _commentWhere;
      let _fileField,
        _fileJoin,
        _fileWhere;
      let _itemField,
        _itemJoin;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

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
        _fileField = ',i.id i_id,i.createdAt i_createdAt,i.updatedAt i_updatedAt,i.userId i_userId,i.downloadId i_downloadId,i.mode i_mode,i.fileSize i_fileSize,i.width i_width,i.height i_height,i.filePath i_filePath,i.fileName i_fileName,i.realName i_realName,i.fileExt i_fileExt,i.encoding i_encoding,i.mime i_mime,i.attachment i_attachment,i.flag i_flag,i.userName i_userName,i.avatar i_avatar';
        _fileJoin = ' inner join aViewFile i on i.atomId=a.id';
        _fileWhere = ` and i.iid=${iid} and i.deleted=0`;
      } else {
        _fileField = '';
        _fileJoin = '';
        _fileWhere = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
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
                a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar
                ${_commentField} ${_fileField}`;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}
            ${_commentJoin}
            ${_fileJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_commentWhere}
             ${_fileWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    _selectAtoms({ iid, userIdWho, tableName, where, orders, page, star, label, comment, file, count }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- c: aViewUserRightAtomRole
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser
      // -- h: aComment
      // -- i: aFile

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let
        _starJoin,
        _starWhere;

      let
        _labelJoin,
        _labelWhere;
      let _commentField,
        _commentJoin,
        _commentWhere;
      let _fileField,
        _fileJoin,
        _fileWhere;
      let _itemField,
        _itemJoin;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

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
        _commentField =
             `,h.id h_id,h.createdAt h_createdAt,h.updatedAt h_updatedAt,h.userId h_userId,h.sorting h_sorting,h.heartCount h_heartCount,h.replyId h_replyId,h.replyUserId h_replyUserId,h.replyContent h_replyContent,h.content h_content,h.summary h_summary,h.html h_html,h.userName h_userName,h.avatar h_avatar,h.replyUserName h_replyUserName,
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
        _fileField = ',i.id i_id,i.createdAt i_createdAt,i.updatedAt i_updatedAt,i.userId i_userId,i.downloadId i_downloadId,i.mode i_mode,i.fileSize i_fileSize,i.width i_width,i.height i_height,i.filePath i_filePath,i.fileName i_fileName,i.realName i_realName,i.fileExt i_fileExt,i.encoding i_encoding,i.mime i_mime,i.attachment i_attachment,i.flag i_flag,i.userName i_userName,i.avatar i_avatar';
        _fileJoin = ' inner join aViewFile i on i.atomId=a.id';
        _fileWhere = ` and i.iid=${iid} and i.deleted=0`;
      } else {
        _fileField = '';
        _fileJoin = '';
        _fileWhere = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
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
                a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar
                ${_starField} ${_labelField} ${_commentField} ${_fileField}`;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aAtom a
            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}
            ${_starJoin}
            ${_labelJoin}
            ${_commentJoin}
            ${_fileJoin}

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_starWhere}
             ${_labelWhere}
             ${_commentWhere}
             ${_fileWhere}
             and (
                     (a.userIdCreated=${userIdWho}) or
                     (
                           a.atomEnabled=1 and
                           (
                               (
                                 a.atomFlow=1 and
                                   (
                                     (
                                       exists(
                                               select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action>2 and c.userIdWho=${userIdWho}
                                             )
                                     ) or
                                     (
                                       a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=${userIdWho}
                                     )
                                   )
                                 )
                               )
                               or
                               (
                                 a.atomFlow=0 and
                                   (
                                     b.public=1 or
                                     exists(
                                             select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
                                           )
                                   )
                               )
                           )
                     )
                 )
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    getAtom({ iid, userIdWho, tableName, atomId }) {
      // -- tables
      // -- a: aAtom
      // -- b: aAtomClass
      // -- d: aAtomStar
      // -- e: aAtomLabelRef
      // -- f: {item}
      // -- g: aUser

      // for safe
      tableName = tableName ? ctx.model.format('??', tableName) : null;

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);

      // vars
      let _starField,
        _labelField;
      let _itemField,
        _itemJoin;

      // star
      if (userIdWho) {
        _starField =
          `,(select d.star from aAtomStar d where d.iid=${iid} and d.atomId=a.id and d.userId=${userIdWho}) as star`;
      } else {
        _starField = '';
      }

      // label
      if (userIdWho) {
        _labelField =
          `,(select e.labels from aAtomLabel e where e.iid=${iid} and e.atomId=a.id and e.userId=${userIdWho}) as labels`;
      } else {
        _labelField = '';
      }

      // tableName
      if (tableName) {
        _itemField = 'f.*,';
        _itemJoin = ` inner join ${tableName} f on f.atomId=a.id`;
      } else {
        _itemField = '';
        _itemJoin = '';
      }

      // sql
      const _sql =
        `select ${_itemField}
                a.id as atomId,a.itemId,a.atomEnabled,a.atomFlag,a.atomFlow,a.atomClassId,a.atomName,a.allowComment,a.starCount,a.commentCount,a.attachmentCount,a.readCount,a.userIdCreated,a.userIdUpdated,a.createdAt as atomCreatedAt,a.updatedAt as atomUpdatedAt,
                b.module,b.atomClassName,b.atomClassIdParent,
                g.userName,g.avatar
                ${_starField}
                ${_labelField}
          from aAtom a

            inner join aAtomClass b on a.atomClassId=b.id
            inner join aUser g on a.userIdCreated=g.id
            ${_itemJoin}

          where a.id=${atomId}
            and a.deleted=0 and a.iid=${iid}
        `;

      // ok
      return _sql;
    }

    checkRightRead({ iid, userIdWho, atomId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      // sql
      const _sql =
        `select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where
             (
                 a.deleted=0 and a.iid=${iid} and a.id=${atomId}
                 and
                 (
                      (a.userIdCreated=${userIdWho})
                      or
                      (
                          a.atomEnabled=1 and
                          (
                              (
                                  a.atomFlow=1 and
                                  (
                                      (
                                        exists(
                                                select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action>2 and c.userIdWho=${userIdWho}
                                              )
                                      )
                                      or
                                      (
                                        a.userIdCreated=${userIdWho} and
                                        exists(
                                                select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action>2 and c.scope=0 and c.userIdWho=${userIdWho}
                                              )
                                      )
                                  )
                              )
                              or
                              (
                                  a.atomFlow=0 and
                                  (
                                      b.public=1 or
                                      exists(
                                              select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=2 and c.userIdWho=${userIdWho}
                                            )
                                  )
                              )
                          )
                      )
                 )
             )
        `;
      return _sql;
    }

    checkRightUpdate({ iid, userIdWho, atomId, action, actionFlag }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);

      actionFlag = ctx.model.format('?', actionFlag);

      // sql
      const _sql =
        `select a.* from aAtom a
           where
           (
             a.deleted=0 and a.iid=${iid} and a.id=${atomId}
             and (
                  (a.atomEnabled=0 and a.userIdCreated=${userIdWho}) or
                  (a.atomEnabled=1 and (
                    (exists(select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.userIdWho=${userIdWho})) or
                    (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.scope=0 and c.userIdWho=${userIdWho}))
                  ))
                )
           )
        `;
      return _sql;
    }

    checkRightAction({ iid, userIdWho, atomId, action, actionFlag }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomId = parseInt(atomId);
      action = parseInt(action);

      actionFlag = ctx.model.format('?', actionFlag);

      // sql
      const _sql =
        `select a.* from aAtom a
            where
            (
               a.deleted=0 and a.iid=${iid} and a.id=${atomId} and a.atomEnabled=1
               and (
                      (exists(select c.atomId from aViewUserRightAtomRole c where c.iid=${iid} and a.id=c.atomId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.userIdWho=${userIdWho})) or
                      (a.userIdCreated=${userIdWho} and exists(select c.atomClassId from aViewUserRightAtomClass c where c.iid=${iid} and a.atomClassId=c.atomClassId and c.action=${action} and (${actionFlag}='' or find_in_set(a.atomFlag,${actionFlag})>0 ) and c.scope=0 and c.userIdWho=${userIdWho}))
                   )
            )
        `;
      return _sql;
    }

    checkRightCreate({ iid, userIdWho, atomClassId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);

      // sql
      const _sql =
        `select a.* from aAtomClass a
            inner join aViewUserRightAtomClass b on a.id=b.atomClassId
              where b.iid=${iid} and b.atomClassId=${atomClassId} and b.action=1 and b.userIdWho=${userIdWho}
        `;
      return _sql;
    }

    checkRightCreateRole({ iid, userIdWho, atomClassId, roleIdOwner }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      atomClassId = parseInt(atomClassId);
      roleIdOwner = parseInt(roleIdOwner);

      // sql
      const _sql =
        `select a.* from aAtomClass a
            inner join aViewUserRightAtomClass b on a.id=b.atomClassId
              where b.iid=${iid} and b.atomClassId=${atomClassId} and b.action=1 and b.userIdWho=${userIdWho} and b.roleId=${roleIdOwner}
        `;
      return _sql;
    }

    selectFunctions({ iid, locale, userIdWho, where, orders, page, star }) {
      // -- tables
      // -- a: aFunction
      // -- b: aFunctionLocale
      // -- c: aViewUserRightFunction
      // -- d: aFunctionStar
      // -- e: aAtomClass
      // -- f: aFunctionScene

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      star = parseInt(star);

      locale = locale ? ctx.model.format('?', locale) : null;

      // vars
      let _starField,
        _starJoin,
        _starWhere;
      let _localeField,
        _localeJoin,
        _localeWhere;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // star
      if (star) {
        _starField = '';
        _starJoin = ' inner join aFunctionStar d on a.id=d.functionId';
        _starWhere = ` and d.iid=${iid} and d.userId=${userIdWho} and d.star=1`;
      } else {
        _starField =
        `,(select d.star from aFunctionStar d where d.iid=${iid} and d.functionId=a.id and d.userId=${userIdWho}) as star`;
        _starJoin = '';
        _starWhere = '';
      }

      // locale
      if (locale) {
        _localeField = ',b.titleLocale';
        _localeJoin = ' inner join aFunctionLocale b on a.id=b.functionId';
        _localeWhere = ` and b.iid=${iid} and b.locale=${locale}`;
      } else {
        _localeField = '';
        _localeJoin = '';
        _localeWhere = '';
      }

      // sql
      const _sql =
        `select a.*,
                e.atomClassName,e.atomClassIdParent
                ${_localeField}
                ${_starField}
           from aFunction a

             left join aAtomClass e on a.atomClassId=e.id
             left join aFunctionScene f on a.sceneId=f.id
             ${_localeJoin}
             ${_starJoin}

             ${_where}

              (
                a.deleted=0 and a.iid=${iid}
                ${_localeWhere}
                ${_starWhere}
                and (
                       a.public=1
                       or
                       exists(
                               select c.functionId from aViewUserRightFunction c where c.iid=${iid} and a.id=c.functionId and c.userIdWho=${userIdWho}
                             )
                    )
              )

            ${_orders}
            ${_limit}
       `;

      // ok
      return _sql;
    }

    checkRightFunction({ iid, userIdWho, functionId }) {
      // for safe
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      functionId = parseInt(functionId);
      // sql
      const _sql =
        `select a.* from aFunction a
            where a.deleted=0 and a.iid=${iid} and a.id=${functionId}
              and ( a.public=1 or
                    exists(select c.functionId from aViewUserRightFunction c where c.iid=${iid} and c.functionId=${functionId} and c.userIdWho=${userIdWho})
                  )
        `;
      return _sql;
    }

    checkFunctionLocales({ iid, locale }) {
      // for safe
      iid = parseInt(iid);
      locale = ctx.model.format('?', locale);
      // sql
      const _sql =
        `select a.* from aFunction a
            where a.iid=${iid}
              and not exists(
                select b.id from aFunctionLocale b
                  where b.iid=${iid} and b.locale=${locale} and b.functionId=a.id
                    and (b.titleLocale is not null and b.titleLocale<>'')
                )
        `;
      return _sql;
    }

  }

  return Procedure;

};


/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionStar extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionStar', options: { disableDeleted: true } });
    }

  }

  return FunctionStar;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionLocale extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionLocale', options: { disableDeleted: true } });
    }

  }

  return FunctionLocale;
};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionScene extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aFunctionScene', options: { disableDeleted: true } });
    }

  }

  return FunctionScene;
};


/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = app => {

  class Role extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRole', options: { disableDeleted: true } });
    }

  }

  return Role;
};


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleInc extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleInc', options: { disableDeleted: true } });
    }

  }

  return RoleInc;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserRole extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserRole', options: { disableDeleted: true } });
    }

  }

  return UserRole;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRight extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRight', options: { disableDeleted: true } });
    }

  }

  return RoleRight;
};


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRightRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRightRef', options: { disableDeleted: true } });
    }

  }

  return RoleRightRef;
};


/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleFunction extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleFunction', options: { disableDeleted: true } });
    }

  }

  return RoleFunction;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const uuid = require3('uuid');

const modelFn = __webpack_require__(20);
const modelAgentFn = __webpack_require__(21);
const modelAuthFn = __webpack_require__(22);
const modelAuthProviderFn = __webpack_require__(23);

const _usersAnonymous = {};

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class User {

    constructor() {
      this._model = null;
      this._modelAgent = null;
      this._modelAuth = null;
      this._modelAuthProvider = null;
      this._sequence = null;
      this._config = null;
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelAgent() {
      if (!this._modelAgent) this._modelAgent = new (modelAgentFn(ctx.app))(ctx);
      return this._modelAgent;
    }

    get modelAuth() {
      if (!this._modelAuth) this._modelAuth = new (modelAuthFn(ctx.app))(ctx);
      return this._modelAuth;
    }

    get modelAuthProvider() {
      if (!this._modelAuthProvider) this._modelAuthProvider = new (modelAuthProviderFn(ctx.app))(ctx);
      return this._modelAuthProvider;
    }

    get sequence() {
      if (!this._sequence) this._sequence = ctx.meta.sequence.module(moduleInfo.relativeName);
      return this._sequence;
    }

    get config() {
      if (!this._config) this._config = ctx.config.module(moduleInfo.relativeName);
      return this._config;
    }

    async anonymous() {
      // cache
      let _userAnonymous = _usersAnonymous[ctx.instance.id];
      if (_userAnonymous) return _userAnonymous;
      // try get
      _userAnonymous = await this.get({ anonymous: 1 });
      if (_userAnonymous) {
        _usersAnonymous[ctx.instance.id] = _userAnonymous;
        return _userAnonymous;
      }
      // add user
      const userId = await this.add({ disabled: 0, anonymous: 1 });
      // addRole
      const role = await ctx.meta.role.getSystemRole({ roleName: 'anonymous' });
      await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      // ready
      _userAnonymous = await this.get({ id: userId });
      _usersAnonymous[ctx.instance.id] = _userAnonymous;
      return _userAnonymous;
    }

    async loginAsAnonymous() {
      const userOp = await this.anonymous();
      const user = {
        op: userOp,
        agent: userOp,
        provider: null,
      };
      await ctx.login(user);
      // maxAge
      const maxAge = this.config.anonymous.maxAge;
      ctx.session.maxAge = maxAge;
      // ok
      return user;
    }

    anonymousId() {
      let _anonymousId = ctx.cookies.get('anonymous', { encrypt: true });
      if (!_anonymousId) {
        _anonymousId = uuid.v4().replace(/-/g, '');
        const maxAge = this.config.anonymous.maxAge;
        ctx.cookies.set('anonymous', _anonymousId, { encrypt: true, maxAge });
      }
      return _anonymousId;
    }

    async check() {
      // check if has ctx.user
      if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent || ctx.user.op.iid !== ctx.instance.id) ctx.throw(401);
      // check if deleted,disabled,agent
      const userOp = await this.get({ id: ctx.user.op.id });
      // deleted
      if (!userOp) ctx.throw.module(moduleInfo.relativeName, 1004);
      // disabled
      if (userOp.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
      // hold user
      ctx.user.op = userOp;
      // agent
      if (ctx.user.agent.id !== ctx.user.op.id) {
        const agent = await this.agent({ userId: ctx.user.op.id });
        if (!agent) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.id !== ctx.user.agent.id) ctx.throw.module(moduleInfo.relativeName, 1006);
        if (agent.disabled) ctx.throw.module(moduleInfo.relativeName, 1005);
        // hold agent
        ctx.user.agent = agent;
      } else {
        // hold agent
        ctx.user.agent = userOp;
      }
    }

    async setActivated({ user }) {
      // save
      if (user.activated !== undefined) delete user.activated;
      await this.save({ user });
      // tryActivate
      const tryActivate = user.emailConfirmed || user.mobileVerified;
      if (tryActivate) {
        await this.userRoleStageActivate({ userId: user.id });
      }
    }

    async userRoleStageAdd({ userId }) {
      // roleNames
      let roleNames = this.config.account.needActivation ? 'registered' : this.config.account.activatedRoles;
      roleNames = roleNames.split(',');
      for (const roleName of roleNames) {
        const role = await ctx.meta.role.get({ roleName });
        await ctx.meta.role.addUserRole({ userId, roleId: role.id });
      }
    }

    async userRoleStageActivate({ userId }) {
      // get
      const user = await this.get({ id: userId });
      // only once
      if (user.activated) return;
      // adjust role
      if (this.config.account.needActivation) {
        // userRoles
        const userRoles = await ctx.meta.role.getUserRolesDirect({ userId });
        // userRolesMap
        const map = {};
        for (const role of userRoles) {
          map[role.roleName] = role;
        }
        // remove from registered
        if (map.registered) {
          const roleRegistered = await ctx.meta.role.getSystemRole({ roleName: 'registered' });
          await ctx.meta.role.deleteUserRole({ userId, roleId: roleRegistered.id });
        }
        // add to activated
        const roleNames = this.config.account.activatedRoles.split(',');
        for (const roleName of roleNames) {
          if (!map[roleName]) {
            const role = await ctx.meta.role.get({ roleName });
            await ctx.meta.role.addUserRole({ userId, roleId: role.id });
          }
        }
      }
      // set activated
      await this.save({
        user: { id: userId, activated: 1 },
      });
    }

    async exists({ userName, email, mobile }) {
      userName = userName || '';
      email = email || '';
      mobile = mobile || '';
      if (this.config.checkUserName === true && userName) {
        return await this.model.queryOne(
          `select * from aUser
             where iid=? and deleted=0 and ((userName=?) or (?<>'' and email=?) or (?<>'' and mobile=?))`,
          [ ctx.instance.id, userName, email, email, mobile, mobile ]);
      }
      return await this.model.queryOne(
        `select * from aUser
             where iid=? and deleted=0 and ((?<>'' and email=?) or (?<>'' and mobile=?))`,
        [ ctx.instance.id, email, email, mobile, mobile ]);
    }

    async add({
      disabled = 0, userName, realName, email, mobile, avatar, motto, locale, anonymous = 0,
    }) {
      // check if incomplete information
      let needCheck;
      if (anonymous) {
        needCheck = false;
      } else if (this.config.checkUserName === true) {
        needCheck = userName || email || mobile;
      } else {
        needCheck = email || mobile;
      }
      // if exists
      if (needCheck) {
        const res = await this.exists({ userName, email, mobile });
        if (res) ctx.throw.module(moduleInfo.relativeName, 1001);
      }
      // insert
      const res = await this.model.insert({
        disabled,
        userName,
        realName,
        email,
        mobile,
        avatar,
        motto,
        locale,
        anonymous,
      });
      return res.insertId;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async save({ user }) {
      if (Object.keys(user).length > 1) {
        await this.model.update(user);
      }
    }

    async agent({ userId }) {
      const sql = `
        select a.* from aUser a
          left join aUserAgent b on a.id=b.userIdAgent
            where a.iid=? and a.deleted=0 and b.userId=?
      `;
      return await ctx.model.queryOne(sql, [ ctx.instance.id, userId ]);
    }

    async agentsBy({ userId }) {
      const sql = `
        select a.* from aUser a
          left join aUserAgent b on a.id=b.userId
            where a.iid=? and a.deleted=0 and b.userIdAgent=?
      `;
      return await ctx.model.query(sql, [ ctx.instance.id, userId ]);
    }

    async addAgent({ userIdAgent, userId }) {
      await this.modelAgent.insert({
        userIdAgent,
        userId,
      });
    }

    async removeAgent({ userIdAgent, userId }) {
      await this.modelAgent.delete({
        userIdAgent,
        userId,
      });
    }

    async switchAgent({ userIdAgent }) {
      const op = ctx.user.op;
      ctx.user.op = await this.get({ id: userIdAgent });
      try {
        await this.check();
        await ctx.login(ctx.user);
        return ctx.user;
      } catch (err) {
        ctx.user.op = op;
        throw err;
      }
    }

    async switchOffAgent() {
      return await this.switchAgent({ userIdAgent: ctx.user.agent.id });
    }

    async list({ roleId, query, anonymous, page }) {
      const roleJoin = roleId ? 'left join aUserRole b on a.id=b.userId' : '';
      const roleWhere = roleId ? `and b.roleId=${ctx.model._format(roleId)}` : '';
      const queryLike = query ? ctx.model._format({ op: 'like', val: query }) : '';
      const queryWhere = query ? `and ( a.userName like ${queryLike} or a.realName like ${queryLike} or a.mobile like ${queryLike} )` : '';
      const anonymousWhere = anonymous !== undefined ? `and a.anonymous=${ctx.model._format(anonymous)}` : '';
      const _limit = ctx.model._limit(page.size, page.index);
      const sql = `
        select a.* from aUser a
          ${roleJoin}
            where a.iid=? and a.deleted=0
                  ${anonymousWhere}
                  ${roleWhere}
                  ${queryWhere}
            ${_limit}
      `;
      return await ctx.model.query(sql, [ ctx.instance.id ]);
    }

    async disable({ userId, disabled }) {
      await this.model.update({ id: userId, disabled });
    }

    async delete({ userId }) {
      await ctx.meta.role.deleteAllUserRoles({ userId });
      await this.model.delete({ id: userId });
    }

    // roles
    async roles({ userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(`
        select a.*,b.roleName from aUserRole a
          left join aRole b on a.roleId=b.id
            where a.iid=? and a.userId=?
            ${_limit}
        `, [ ctx.instance.id, userId ]);
    }

    // state: login/associate
    async verify({ state = 'login', profileUser }) {
      // verifyUser
      const verifyUser = {};

      // provider
      const providerItem = await this.getAuthProvider({
        module: profileUser.module,
        providerName: profileUser.provider,
      });

      // check if auth exists
      const authItem = await this.modelAuth.get({
        providerId: providerItem.id,
        profileId: profileUser.profileId,
      });
      // avatar
      await this._prepareAvatar({ authItem, profile: profileUser.profile });
      // auth
      let authId;
      let authUserId;
      if (authItem) {
        // update
        authItem.profile = JSON.stringify(profileUser.profile);
        await this.modelAuth.update(authItem);
        authId = authItem.id;
        authUserId = authItem.userId;
      } else {
        if (profileUser.authShouldExists === true) ctx.throw.module(moduleInfo.relativeName, 1009);
        // add
        const res = await this.modelAuth.insert({
          providerId: providerItem.id,
          profileId: profileUser.profileId,
          profile: JSON.stringify(profileUser.profile),
        });
        authId = res.insertId;
      }
      verifyUser.provider = {
        id: authId,
        providerId: providerItem.id,
        module: profileUser.module,
        providerName: profileUser.provider,
        // profile: profileUser.profile,  // maybe has private info
      };

      // columns
      const columns = [
        'userName', 'realName', 'email', 'mobile', 'avatar', 'motto', 'locale',
      ];

      //
      let userId;
      if (state === 'associate') {
        // check if ctx.user exists
        if (!ctx.user || ctx.user.agent.anonymous) return false;
        userId = ctx.user.agent.id;
        // associated
        // update user
        await this._updateUserInfo(userId, profileUser.profile, columns);
        // force update auth's userId, maybe different
        if (authUserId !== userId) {
          // delete old records
          await this.modelAuth.delete({
            providerId: providerItem.id,
            userId,
          });
          // update
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = ctx.user.op;
        verifyUser.agent = ctx.user.agent;
      } else if (state === 'login') {
        // check if user exists
        let user;
        if (authUserId) {
          user = await this.model.get({ id: authUserId });
        }
        if (user) {
          // check if disabled
          if (user.disabled) return false;
          // update user
          await this._updateUserInfo(user.id, profileUser.profile, columns);
          userId = user.id;
        } else {
          // add user
          userId = await this._addUserInfo(profileUser.profile, columns);
          user = await this.model.get({ id: userId });
          // update auth's userId
          await this.modelAuth.update({
            id: authId,
            userId,
          });
        }
        // ready
        verifyUser.op = user;
        verifyUser.agent = user;
      }

      // restore maxAge
      if (profileUser.maxAge === 0) {
        ctx.session.maxAge = 0;
      } else {
        ctx.session.maxAge = profileUser.maxAge || this.config.authenticated.maxAge;
      }

      // user verify event
      await ctx.meta.event.invoke({
        module: moduleInfo.relativeName, name: 'userVerify', data: { verifyUser, profileUser },
      });

      // ok
      return verifyUser;
    }

    async _downloadAvatar({ avatar }) {
      const timeout = this.config.auth.avatar.timeout;
      let res;
      try {
        res = await ctx.curl(avatar, { method: 'GET', timeout });
      } catch (err) {
        res = await ctx.curl(this.config.auth.avatar.default, { method: 'GET', timeout });
      }
      return res;
    }

    async _prepareAvatar({ authItem, profile }) {
      // avatar
      let avatarOld;
      let _avatarOld;
      if (authItem) {
        const _profile = JSON.parse(authItem.profile);
        avatarOld = _profile.avatar;
        _avatarOld = _profile._avatar;
      }
      if (!profile.avatar || profile.avatar === avatarOld) {
        profile._avatar2 = _avatarOld;
        return;
      }
      // download image
      const res = await this._downloadAvatar({ avatar: profile.avatar });
      // meta
      const mime = res.headers['content-type'] || '';
      const ext = mime.split('/')[1] || '';
      const meta = {
        filename: `user-avatar.${ext}`,
        encoding: '7bit',
        mime,
        fields: {
          mode: 1,
          flag: `user-avatar:${profile.avatar}`,
        },
      };
      // upload
      const res2 = await ctx.performAction({
        method: 'post',
        url: '/a/file/file/uploadInner',
        body: {
          file: res.data,
          meta,
        },
      });
      // hold
      profile._avatar = res2.downloadUrl;
    }

    async _addUserInfo(profile, columns) {
      const user = {};
      for (const column of columns) {
        // others
        await this._setUserInfoColumn(user, column, profile);
      }
      // add user
      const userId = await this.add(user);
      // add role
      await this.userRoleStageAdd({ userId });
      // try setActivated
      const data = { id: userId };
      // emailConfirmed
      if (profile.emailConfirmed && profile.email) {
        data.emailConfirmed = 1;
      }
      // mobileVerified
      if (profile.mobileVerified && profile.mobile) {
        data.mobileVerified = 1;
      }
      // setActivated
      await this.setActivated({ user: data });
      // ok
      return userId;
    }

    async _updateUserInfo(userId, profile, columns) {
      const users = await this.model.select({
        where: { id: userId },
        columns,
      });
      const user = users[0];
      for (const column of columns) {
        await this._setUserInfoColumn(user, column, profile);
      }
      user.id = userId;
      await this.save({ user });
    }

    async _setUserInfoColumn(user, column, profile) {
      // avatar / if empty
      if (column === 'avatar' && !user[column] && profile._avatar2) {
        user[column] = profile._avatar2;
        return;
      }
      // avatar / if changed
      if (column === 'avatar' && profile._avatar) {
        user[column] = profile._avatar;
        return;
      }
      // value
      let value = profile[column];
      // only set when empty
      if (user[column] || !value) return;
      // userName
      if (column === 'userName') {
        const res = await this.exists({ [column]: value });
        if (res) {
          // sequence
          const sequence = await this.sequence.next('userName');
          value = `${value}__${sequence}`;
        }
      } else if (column === 'email' || column === 'mobile') {
        const res = await this.exists({ [column]: value });
        if (res) {
          value = null;
        }
      }
      if (value) {
        user[column] = value;
      }
    }

    async getAuthProvider({ subdomain, iid, id, module, providerName }) {
      // ctx.instance maybe not exists
      const data = id ? {
        iid: iid || ctx.instance.id,
        id,
      } : {
        iid: iid || ctx.instance.id,
        module,
        providerName,
      };
      const res = await ctx.db.get('aAuthProvider', data);
      if (res) return res;
      if (!module || !providerName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: subdomain || ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAuthProvider',
        data: { module, providerName },
      });
    }

    async registerAuthProvider({ module, providerName }) {
      // get
      const res = await this.modelAuthProvider.get({ module, providerName });
      if (res) return res;
      // data
      const _module = ctx.app.meta.modules[module];
      const _provider = _module.main.meta.auth.providers[providerName];
      if (!_provider) throw new Error(`authProvider ${module}:${providerName} not found!`);
      const data = {
        module,
        providerName,
        config: JSON.stringify(_provider.config),
        disabled: 0,
      };
      // insert
      const res2 = await this.modelAuthProvider.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return User;
};


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = app => {

  class User extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUser', options: { disableDeleted: false } });
    }

  }

  return User;
};


/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserAgent extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aUserAgent', options: { disableDeleted: true } });
    }

  }

  return UserAgent;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = app => {

  class Auth extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuth', options: { disableDeleted: true } });
    }

  }

  return Auth;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = app => {

  class AuthProvider extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aAuthProvider', options: { disableDeleted: true } });
    }

  }

  return AuthProvider;
};


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

const config = __webpack_require__(25);
const locales = __webpack_require__(26);
const errors = __webpack_require__(28);
const middlewares = __webpack_require__(29);
const constants = __webpack_require__(1);

// eslint-disable-next-line
module.exports = app => {

  // routes
  const routes = __webpack_require__(48)(app);
  // services
  const services = __webpack_require__(61)(app);
  // models
  const models = __webpack_require__(87)(app);
  // meta
  const meta = __webpack_require__(94)(app);

  return {
    routes,
    services,
    models,
    config,
    locales,
    errors,
    middlewares,
    constants,
    meta,
  };

};


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // middlewares
  config.middlewares = {
    util: {
      global: true,
    },
    cors: {
      global: true,
      dependencies: 'instance',
    },
    base: {
      global: true,
      dependencies: 'instance,event',
    },
    auth: {
      global: true,
      dependencies: 'base,sequence',
      ignore: /\/version\/(update|init|test)/,
    },
    right: {
      global: true,
      dependencies: 'auth,validation',
    },
    jsonp: {
      global: false,
      dependencies: 'instance',
    },
    httpLog: {
      global: false,
      dependencies: 'instance',
    },
  };

  // startups
  config.startups = {
    installAllSchedules: {
      path: 'schedule/installAllSchedules',
    },
    installAuthProviders: {
      path: 'auth/installAuthProviders',
    },
    setFunctionLocales: {
      instance: true,
      path: 'function/setLocalesStartup',
    },
  };

  // queues
  config.queues = {
    setFunctionLocales: {
      path: 'function/setLocalesQueue',
    },
    registerFunction: {
      path: 'function/register',
    },
    registerAtomAction: {
      path: 'atomAction/register',
    },
    registerAtomClass: {
      path: 'atomClass/register',
    },
    registerAuthProvider: {
      path: 'auth/register',
    },
    schedule: {
      path: 'schedule/scheduleQueue',
      repeat: true,
    },
    startup: {
      path: 'startup/startupQueue',
    },
  };

  // broadcasts
  config.broadcasts = {
    authProviderChanged: {
      path: 'auth/providerChanged',
    },
  };

  // pageSize
  config.pageSize = 20;

  // locales
  config.locales = {
    'en-us': 'English',
    'zh-cn': 'Chinese',
  };

  // function
  config.function = {
    scenes: {
      1: 'demonstration,create,list,tools', // menu
    },
  };

  // anonymous
  config.anonymous = {
    maxAge: 365 * 24 * 3600 * 1000, // 365 天
  };
  // authenticated or rememberMe
  config.authenticated = {
    maxAge: 30 * 24 * 3600 * 1000, // 30 天
  };
  // checkUserName
  config.checkUserName = true;
  // account
  config.account = {
    needActivation: true,
    activationWays: 'mobile,email',
    activationProviders: {
      mobile: '', // a-authsms recommended
      email: 'a-authsimple',
    },
    url: {
      // url is specified by activation provider
      //   emailConfirm: '/a/authsimple/emailConfirm',
      //   mobileVerify: '',
      //   passwordChange: '/a/authsimple/passwordChange',
      //   passwordForgot: '/a/authsimple/passwordForgot',
      //   passwordReset: '/a/authsimple/passwordReset',
    },
    //  default is 'activated', if need activating by mobile/email, then add to 'registered' first
    activatedRoles: 'activated',
  };

  // public dir
  config.publicDir = '';

  // comment
  config.comment = {
    trim: {
      limit: 100,
      wordBreak: false,
      preserveTags: false,
    },
  };

  // httpLog
  config.httpLog = true;

  // auth
  config.auth = {
    avatar: {
      timeout: 5000,
      default: 'https://cabloy.com/plugins/cms-pluginbase/assets/images/avatar_user.png',
    },
  };

  return config;
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'zh-cn': __webpack_require__(27),
};


/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = {
  'Comment List': '评论列表',
  'Delete Comment': '删除评论',
  'Element Exists': '元素已存在',
  'Element does not Exist': '元素不存在',
  'Operation Failed': '操作失败',
  'User does not Exist': '用户不存在',
  'User is Disabled': '用户被禁用',
  'Agent user does not Exist': '代理用户不存在',
  'Incomplete Information': '信息不完整',
  'Should Delete Children first': '应该先删除子角色',
  'Cannot Contain __': '不能包含__',
  'The Auth should be Enabled': '此认证需要被启用',
  'Atom Flag': '原子标记',
  'Atom Name': '原子名称',
  'Modification Time': '修改时间',
  'Created Time': '创建时间',
  Draft: '草稿',
  Base: '基本',
  English: '英文',
  Chinese: '中文',
  Create: '新建',
  List: '列表',
  Tools: '工具',
  View: '查看',
  Edit: '编辑',
  Delete: '删除',
  Save: '保存',
  Submit: '提交',
  Atom: '原子',
  Menu: '菜单',
  Search: '搜索',
};


/***/ }),
/* 28 */
/***/ (function(module, exports) {

// error code should start from 1001
module.exports = {
  1001: 'Element Exists',
  1002: 'Element does not Exist',
  1003: 'Operation Failed',
  1004: 'User does not Exist',
  1005: 'User is Disabled',
  1006: 'Agent user does not Exist',
  1007: 'Incomplete Information',
  1008: 'Should Delete Children first',
  1009: 'The Auth should be Enabled',
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

const util = __webpack_require__(30);
const cors = __webpack_require__(32);
const base = __webpack_require__(34);
const auth = __webpack_require__(44);
const right = __webpack_require__(45);
const jsonp = __webpack_require__(46);
const httpLog = __webpack_require__(47);

module.exports = {
  util,
  cors,
  base,
  auth,
  right,
  jsonp,
  httpLog,
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

// util
const UtilFn = __webpack_require__(31);
const UTIL = Symbol('CTX#__UTIL');

module.exports = () => {
  return async function util(ctx, next) {
    ctx.meta = ctx.meta || {};

    // util
    Object.defineProperty(ctx.meta, 'util', {
      get() {
        if (ctx.meta[UTIL] === undefined) {
          ctx.meta[UTIL] = new (UtilFn(ctx))();
        }
        return ctx.meta[UTIL];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const moment = require3('moment');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Util {

    page(_page, force = true) {
      const pageSize = ctx.config.module(moduleInfo.relativeName).pageSize;
      if (!_page) {
        _page = force ? { index: 0 } : { index: 0, size: 0 };
      }
      if (_page.size === undefined || (force && (_page.size === 0 || _page.size === -1 || _page.size > pageSize))) _page.size = pageSize;
      return _page;
    }

    user(_user) {
      return _user || ctx.user.op;
    }

    now() {
      return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    today() {
      return moment().format('YYYY-MM-DD');
    }

    formatDateTime(date, fmt) {
      date = date || new Date();
      fmt = fmt || 'YYYY-MM-DD HH:mm:ss';
      if (typeof (date) !== 'object') date = new Date(date);
      return moment(date).format(fmt);
    }

    formatDate(date, sep) {
      if (this.isUndefined(sep)) sep = '-';
      const fmt = `YYYY${sep}MM${sep}DD`;
      return this.formatDateTime(date, fmt);
    }

    formatTime(date, sep) {
      if (this.isUndefined(sep)) sep = ':';
      const fmt = `HH${sep}mm${sep}ss`;
      return this.formatDateTime(date, fmt);
    }

    fromNow(date) {
      if (typeof (date) !== 'object') date = new Date(date);
      return moment(date).fromNow();
    }

    replaceTemplate(content, scope) {
      if (!content) return null;
      return content.toString().replace(/(\\)?{{ *(\w+) *}}/g, (block, skip, key) => {
        if (skip) {
          return block.substring(skip.length);
        }
        return scope[key] !== undefined ? scope[key] : '';
      });
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    combinePagePath(moduleName, arg) {
      if (!arg || typeof arg !== 'string') return arg;
      const first = arg.charAt(0);
      if (first === '/' || first === '#') return arg;
      const moduleInfo = typeof moduleName === 'string' ? mparse.parseInfo(moduleName) : moduleName;
      return `/${moduleInfo.url}/${arg}`;
    }

  }

  return Util;
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const URL = __webpack_require__(33).URL;
const extend = require3('extend2');
const isSafeDomainUtil = require3('egg-security').utils.isSafeDomain;
const koaCors = require3('@koa/cors');

const optionsDefault = {
  // origin: undefined,
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // exposeHeaders: '',
  // allowHeaders: '',
  // maxAge: 0,
  credentials: true,
  // keepHeadersOnError:undefined,
};

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function cors(ctx, next) {
    // options
    const optionsCors = extend(true, {}, optionsDefault, options);

    // whiteList
    let whiteListCors;
    const _config = ctx.config.module(moduleInfo.relativeName);
    const _whiteList = (_config && _config.cors && _config.cors.whiteList) || [];
    if (!Array.isArray(_whiteList)) {
      whiteListCors = _whiteList.split(',');
    } else {
      whiteListCors = _whiteList.concat();
    }
    // inherits from jsonp
    let _whiteListJsonp = _config && _config.jsonp && _config.jsonp.whiteList;
    if (_whiteListJsonp) {
      if (!Array.isArray(_whiteListJsonp)) {
        _whiteListJsonp = _whiteListJsonp.split(',');
      }
      whiteListCors = whiteListCors.concat(_whiteListJsonp);
    }

    // origin
    // if security plugin enabled, and origin config is not provided, will only allow safe domains support CORS.
    optionsCors.origin = optionsCors.origin || function corsOrigin(ctx) {
      // origin is {protocol}{hostname}{port}...
      const origin = ctx.get('origin');
      if (!origin) return '';

      let parsedUrl;
      try {
        parsedUrl = new URL(origin);
      } catch (err) {
        return '';
      }

      if (isSafeDomainUtil(parsedUrl.hostname, whiteListCors) || isSafeDomainUtil(origin, whiteListCors)) {
        return origin;
      }
      return '';
    };

    // cors
    const fn = koaCors(optionsCors);
    await fn(ctx, next);
  };
};


/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

// base
const BaseFn = __webpack_require__(35);
const BASE = Symbol('CTX#__BASE');

// atomClass
const AtomClassFn = __webpack_require__(38);
const ATOMCLASS = Symbol('CTX#__ATOMCLASS');

// atomClass
const AtomActionFn = __webpack_require__(39);
const ATOMACTION = Symbol('CTX#__ATOMACTION');

// atom
const AtomFn = __webpack_require__(40);
const ATOM = Symbol('CTX#__ATOM');

// function
const FunctionFn = __webpack_require__(41);
const FUNCTION = Symbol('CTX#__FUNCTION');

// role
const RoleFn = __webpack_require__(42);
const ROLE = Symbol('CTX#__ROLE');

// user
const UserFn = __webpack_require__(19);
const USER = Symbol('CTX#__USER');

// user
const AuthFn = __webpack_require__(43);
const AUTH = Symbol('CTX#__AUTH');

module.exports = () => {
  return async function base(ctx, next) {
    ctx.meta = ctx.meta || {};
    // base
    Object.defineProperty(ctx.meta, 'base', {
      get() {
        if (ctx.meta[BASE] === undefined) {
          ctx.meta[BASE] = new (BaseFn(ctx))();
        }
        return ctx.meta[BASE];
      },
    });
    // atomClass
    Object.defineProperty(ctx.meta, 'atomClass', {
      get() {
        if (ctx.meta[ATOMCLASS] === undefined) {
          ctx.meta[ATOMCLASS] = new (AtomClassFn(ctx))();
        }
        return ctx.meta[ATOMCLASS];
      },
    });
    // atomAction
    Object.defineProperty(ctx.meta, 'atomAction', {
      get() {
        if (ctx.meta[ATOMACTION] === undefined) {
          ctx.meta[ATOMACTION] = new (AtomActionFn(ctx))();
        }
        return ctx.meta[ATOMACTION];
      },
    });
    // atom
    Object.defineProperty(ctx.meta, 'atom', {
      get() {
        if (ctx.meta[ATOM] === undefined) {
          ctx.meta[ATOM] = new (AtomFn(ctx))();
        }
        return ctx.meta[ATOM];
      },
    });
    // function
    Object.defineProperty(ctx.meta, 'function', {
      get() {
        if (ctx.meta[FUNCTION] === undefined) {
          ctx.meta[FUNCTION] = new (FunctionFn(ctx))();
        }
        return ctx.meta[FUNCTION];
      },
    });
    // role
    Object.defineProperty(ctx.meta, 'role', {
      get() {
        if (ctx.meta[ROLE] === undefined) {
          ctx.meta[ROLE] = new (RoleFn(ctx))();
        }
        return ctx.meta[ROLE];
      },
    });
    // user
    Object.defineProperty(ctx.meta, 'user', {
      get() {
        if (ctx.meta[USER] === undefined) {
          ctx.meta[USER] = new (UserFn(ctx))();
        }
        return ctx.meta[USER];
      },
    });
    // auth
    Object.defineProperty(ctx.meta, 'auth', {
      get() {
        if (ctx.meta[AUTH] === undefined) {
          ctx.meta[AUTH] = new (AuthFn(ctx))();
        }
        return ctx.meta[AUTH];
      },
    });

    // next
    await next();
  };
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

const path = __webpack_require__(36);
const require3 = __webpack_require__(0);
const fse = require3('fs-extra');
const constants = __webpack_require__(1);

const _modulesLocales = {};
const _themesLocales = {};
const _locales = {};
const _atomClasses = {};
const _actions = {};
const _flags = {};
const _orders = {};
const _functions = {};
const _menus = {};
const _panels = {};
const _widgets = {};
const _sections = {};
const _buttons = {};
const _authProvidersLocales = {};

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    // other module's base
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get host() {
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.host || ctx.host;
    }

    get protocol() {
      const config = ctx.config.module(moduleInfo.relativeName);
      return config.protocol || ctx.protocol;
    }

    getAbsoluteUrl(path) {
      const prefix = this.host ? `${this.protocol}://${this.host}` : '';
      return `${prefix}${path}`;
    }

    // get forward url
    getForwardUrl(path) {
      const prefix = (ctx.app.meta.isTest || ctx.app.meta.isLocal) ? ctx.app.config.static.prefix : '/public/';
      return `${prefix}${ctx.instance.id}/${path}`;
    }

    // get root path
    async getRootPath() {
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        return ctx.app.config.static.dir;
      }
      const dir = ctx.config.module(moduleInfo.relativeName).publicDir || path.join(__webpack_require__(37).homedir(), 'cabloy', ctx.app.name, 'public');
      await fse.ensureDir(dir);
      return dir;
    }

    // get path
    async getPath(subdir, ensure) {
      const rootPath = await this.getRootPath();
      const dir = path.join(rootPath, ctx.instance.id.toString(), subdir || '');
      if (ensure) {
        await fse.ensureDir(dir);
      }
      return dir;
    }

    // alert
    getAlertUrl({ data }) {
      return this.getAbsoluteUrl(`/#!/a/base/base/alert?data=${encodeURIComponent(JSON.stringify(data))}`);
    }

    authProviders() {
      if (!_authProvidersLocales[ctx.locale]) {
        _authProvidersLocales[ctx.locale] = this._prepareAuthProviders();
      }
      return _authProvidersLocales[ctx.locale];
    }

    modules() {
      if (!_modulesLocales[ctx.locale]) {
        _modulesLocales[ctx.locale] = this._prepareModules();
      }
      return _modulesLocales[ctx.locale];
    }

    themes() {
      if (!_themesLocales[ctx.locale]) {
        _themesLocales[ctx.locale] = this._prepareThemes();
      }
      return _themesLocales[ctx.locale];
    }

    locales() {
      if (!_locales[ctx.locale]) {
        _locales[ctx.locale] = this._prepareLocales();
      }
      return _locales[ctx.locale];
    }

    atomClasses() {
      if (!_atomClasses[ctx.locale]) {
        _atomClasses[ctx.locale] = this._prepareAtomClasses();
      }
      return _atomClasses[ctx.locale];
    }

    atomClass({ module, atomClassName }) {
      const _atomClasses = this.atomClasses();
      return _atomClasses[module] && _atomClasses[module][atomClassName];
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, atomClassName, code, name }) {
      const _actions = this.actions();
      const actions = _actions[module][atomClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    flags() {
      if (!_flags[ctx.locale]) {
        _flags[ctx.locale] = this._prepareFlags();
      }
      return _flags[ctx.locale];
    }

    orders() {
      if (!_orders[ctx.locale]) {
        _orders[ctx.locale] = this._prepareOrders();
      }
      return _orders[ctx.locale];
    }

    menus() {
      if (!_menus[ctx.locale]) {
        _menus[ctx.locale] = this._prepareMenus(1);
      }
      return _menus[ctx.locale];
    }

    panels() {
      if (!_panels[ctx.locale]) {
        _panels[ctx.locale] = this._prepareMenus(2);
      }
      return _panels[ctx.locale];
    }

    widgets() {
      if (!_widgets[ctx.locale]) {
        _widgets[ctx.locale] = this._prepareMenus(3);
      }
      return _widgets[ctx.locale];
    }

    sections() {
      if (!_sections[ctx.locale]) {
        _sections[ctx.locale] = this._prepareMenus(4);
      }
      return _sections[ctx.locale];
    }

    buttons() {
      if (!_buttons[ctx.locale]) {
        _buttons[ctx.locale] = this._prepareMenus(5);
      }
      return _buttons[ctx.locale];
    }

    functions() {
      if (!_functions[ctx.locale]) {
        _functions[ctx.locale] = this._prepareFunctions();
      }
      return _functions[ctx.locale];
    }

    function({ module, name }) {
      const _functions = this.functions();
      return _functions[module][name];
    }

    functionsAutoRight({ module, atomClassName, action }) {
      const functions = {};
      const _functions = this.functions();
      for (const key in _functions[module]) {
        const _func = _functions[module][key];
        const _action = typeof action === 'string' ? _func.action : ctx.constant.module(moduleInfo.relativeName).atom.action[_func.action];
        if (_func.autoRight && _func.atomClassName === atomClassName && _action === action) {
          functions[key] = _func;
        }
      }
      return functions;
    }

    // inner methods

    _prepareAuthProviders() {
      const authProviders = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.auth && module.main.meta.auth.providers) {
          for (const providerName in module.main.meta.auth.providers) {
            const _authProvider = module.main.meta.auth.providers[providerName];
            const authProvider = {
              meta: _authProvider.meta,
              config: _authProvider.config,
              handler: _authProvider.handler,
            };
            if (authProvider.meta && authProvider.meta.title) {
              authProvider.meta.titleLocale = ctx.text(authProvider.meta.title);
            }
            authProviders[`${relativeName}:${providerName}`] = authProvider;
          }
        }
      }
      return authProviders;
    }

    _prepareModules() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const _module = {
          name: relativeName,
          title: module.package.title || module.info.name,
          description: ctx.text(module.package.description),
          info: module.info,
        };
        _module.titleLocale = ctx.text(_module.title);
        modules[relativeName] = _module;
      }
      return modules;
    }

    _prepareThemes() {
      const modules = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.package.eggBornModule && module.package.eggBornModule.theme) {
          const _module = {
            name: relativeName,
            title: module.package.title || module.info.name,
            description: ctx.text(module.package.description),
            info: module.info,
          };
          _module.titleLocale = ctx.text(_module.title);
          modules[relativeName] = _module;
        }
      }
      return modules;
    }

    _prepareLocales() {
      const locales = [];
      const config = ctx.config.module(moduleInfo.relativeName);
      for (const locale in config.locales) {
        locales.push({
          title: ctx.text(config.locales[locale]),
          value: locale,
        });
      }
      return locales;
    }

    _prepareAtomClasses() {
      const atomClasses = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          const res = this._prepareAtomClassesModule(module, module.main.meta.base.atoms);
          if (Object.keys(res).length > 0) {
            atomClasses[relativeName] = res;
          }
        }
      }
      return atomClasses;
    }

    _prepareAtomClassesModule(module, _atoms) {
      const atomClasses = {};
      for (const key in _atoms) {
        const _atom = _atoms[key].info;
        // info
        const atomClass = {
          name: key,
          title: _atom.title || key,
          public: _atom.public ? 1 : 0,
          flow: _atom.flow ? 1 : 0,
          meta: _atom.meta,
        };
        // tableName
        for (const key in _atom) {
          if (key.indexOf('tableName') === 0) {
            atomClass[key] = _atom[key];
          }
        }
        // titleLocale
        atomClass.titleLocale = ctx.text(atomClass.title);
        // ok
        atomClasses[key] = atomClass;
      }
      return atomClasses;
    }

    _prepareFlags() {
      const flags = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          flags[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            flags[relativeName][atomClassName] = this._prepareFlagsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      return flags;
    }

    _prepareFlagsAtomClass(module, atomClass) {
      const flags = {};
      const _flags = atomClass.flags;
      for (const key in _flags) {
        const flag = {
          title: _flags[key].title,
        };
        flag.titleLocale = ctx.text(flag.title);
        flags[key] = flag;
      }
      return flags;
    }

    _prepareOrders() {
      const orders = {};
      // modules
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          orders[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            orders[relativeName][atomClassName] = this._prepareOrdersAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      // base
      orders.base = this._prepareOrdersBase();
      // ok
      return orders;
    }

    _prepareOrdersAtomClass(module, atomClass) {
      if (!atomClass.orders) return null;
      return atomClass.orders.map(item => {
        return {
          name: item.name,
          title: item.title,
          by: item.by,
          tableAlias: item.tableAlias || 'f',
          titleLocale: ctx.text(item.title),
        };
      });
    }

    _prepareOrdersBase() {
      return constants.atom.orders.map(item => {
        return {
          name: item.name,
          title: item.title,
          by: item.by,
          tableAlias: item.tableAlias,
          titleLocale: ctx.text(item.title),
        };
      });
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          actions[relativeName] = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            actions[relativeName][atomClassName] = this._prepareActionsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
          }
        }
      }
      return actions;
    }

    _prepareActionsAtomClass(module, atomClass) {
      const actions = {};
      const _actions = atomClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).atom.actionMeta;
      //  _actionsSystem
      for (const key in _actionsSystem) {
        if (key !== 'custom') {
          const action = {
            code: _actionsSystem[key],
            name: key,
            title: _actionsSystemMeta[key].title,
            flag: (_actions && _actions[key] && _actions[key].flag) || '',
            authorize: _actionsSystemMeta[key].authorize !== false,
          };
          if (_actions && _actions[key] && (_actions[key].actionComponent || _actions[key].actionPath)) {
            // custom
            action.actionModule = _actions[key].actionModule || module.info.relativeName;
            action.actionComponent = _actions[key].actionComponent;
            action.actionPath = _actions[key].actionPath;
            action.meta = _actions[key].meta;
          } else {
            // default
            action.actionModule = moduleInfo.relativeName;
            action.actionComponent = _actionsSystemMeta[key].actionComponent;
            action.actionPath = _actionsSystemMeta[key].actionPath;
            action.meta = (_actions && _actions[key] && _actions[key].meta) || _actionsSystemMeta[key].meta;
          }
          action.titleLocale = ctx.text(action.title);
          actions[key] = action;
        }
      }
      //  _actions
      if (_actions) {
        for (const key in _actions) {
          if (!_actionsSystem[key]) {
            const action = {
              code: _actions[key].code,
              name: key,
              title: _actions[key].title || key,
              flag: _actions[key].flag || '',
              actionModule: _actions[key].actionModule || module.info.relativeName,
              actionComponent: _actions[key].actionComponent,
              actionPath: _actions[key].actionPath,
              authorize: _actions[key].authorize !== false,
              meta: _actions[key].meta,
            };
            if (!_actions[key].actionComponent && !_actions[key].actionPath) {
              // default
              action.actionModule = _actions[key].actionModule || moduleInfo.relativeName;
              action.actionComponent = 'action';
              action.actionPath = '';
            } else {
              // custom
              action.actionModule = _actions[key].actionModule || module.info.relativeName;
              action.actionComponent = _actions[key].actionComponent;
              action.actionPath = _actions[key].actionPath;
            }
            action.titleLocale = ctx.text(action.title);
            actions[key] = action;
          }
        }
      }
      return actions;
    }

    _prepareMenus(functionType) {
      const menus = {};
      const functions = this._prepareFunctions();
      for (const relativeName in functions) {
        const functionsModule = functions[relativeName];
        const _menus = {};
        for (const key in functionsModule) {
          const func = functionsModule[key];
          // 2018.12.22 menu maybe 0 for special scene
          if (functionType === 1) {
            if (func.menu === 1 || (func.actionComponent || func.actionPath)) {
              _menus[key] = func;
            }
          } else if (func.menu === functionType) {
            _menus[key] = func;
          }
        }
        if (Object.keys(_menus).length > 0) {
          menus[relativeName] = _menus;
        }
      }
      return menus;
    }

    _prepareFunctions() {
      const functions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.functions) {
          functions[relativeName] = this._prepareFunctionsModule(module, module.main.meta.base.functions);
        }
      }
      return functions;
    }

    _prepareFunctionsModule(module, _functions) {
      const functions = {};
      if (Array.isArray(_functions)) {
        // array
        for (const _func of _functions) {
          const key = _functions.name;
          functions[key] = this._prepareFunctionsModule_function(module, _func, key);
        }
      } else {
        // object
        for (const key in _functions) {
          functions[key] = this._prepareFunctionsModule_function(module, _functions[key], key);
        }
      }
      return functions;
    }

    _prepareFunctionsModule_function(module, _func, key) {
      const func = {
        module: module.info.relativeName,
        name: key,
        title: _func.title || key,
        scene: _func.scene,
        autoRight: _func.autoRight || 0,
        atomClassName: _func.atomClassName,
        action: _func.action,
        actionModule: _func.actionModule || module.info.relativeName,
        actionComponent: _func.actionComponent,
        actionPath: _func.actionPath,
        sorting: _func.sorting || 0,
        menu: _func.menu || 0,
        public: _func.public ? 1 : 0,
        url: ctx.meta.util.combinePagePath(module.info, _func.url),
        component: _func.component,
      };
      func.titleLocale = ctx.text(func.title);
      // create
      if (func.action === 'create' && !func.actionComponent && !func.actionPath) {
        func.actionModule = 'a-base';
        func.actionComponent = 'action';
        // func.actionPath = '/a/base/atom/edit?atomId={{atomId}}&itemId={{itemId}}&atomClassId={{atomClassId}}&atomClassName={{atomClassName}}&atomClassIdParent={{atomClassIdParent}}';
      }
      // list
      if (func.action === 'read' && !func.actionComponent && !func.actionPath) {
        func.actionPath = '/a/base/atom/list?module={{module}}&atomClassName={{atomClassName}}';
      }
      // ok
      return func;
    }

  }

  return Base;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(3);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomClass {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
    }

    // other module's atomClass
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    async atomClass(atomClass) {
      atomClass = await this.top(atomClass);
      return ctx.meta.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    async top(atomClass) {
      while (true) {
        if (atomClass.atomClassIdParent === 0) break;
        atomClass = await this.get({ id: atomClass.atomClassIdParent });
      }
      return atomClass;
    }

    async get({ id, module, atomClassName, atomClassIdParent = 0 }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, atomClassName, atomClassIdParent };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !atomClassName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAtomClass',
        data: { module, atomClassName, atomClassIdParent },
      });
    }

    async register({ module, atomClassName, atomClassIdParent }) {
      // get
      const res = await this.model.get({ module, atomClassName, atomClassIdParent });
      if (res) return res;
      // data
      const atomClass = ctx.meta.base.atomClass({ module, atomClassName });
      if (!atomClass) throw new Error(`atomClass ${module}:${atomClassName} not found!`);
      const data = {
        module,
        atomClassName,
        atomClassIdParent,
        public: atomClass.public,
        flow: atomClass.flow,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getByAtomId({ atomId }) {
      const res = await this.model.query(`
        select a.* from aAtomClass a
          left join aAtom b on a.id=b.atomClassId
            where b.iid=? and b.id=?
        `, [ ctx.instance.id, atomId ]);
      return res[0];
    }

    async getTopByAtomId({ atomId }) {
      const atomClass = await this.getByAtomId({ atomId });
      return await this.top(atomClass);
    }

    async validator({ atomClass, user }) {
      // maybe empty
      user = user || ctx.user.op;
      // event
      const res = await ctx.meta.event.invoke({
        module: moduleInfo.relativeName,
        name: 'atomClassValidator',
        data: {
          atomClass, user,
        },
      });
      if (res) return res;
      // default
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].validator;
      return validator ? {
        module: atomClass.module,
        validator,
      } : null;
    }

    async validatorSearch({ atomClass }) {
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].search.validator;
      return validator ? {
        module: atomClass.module,
        validator,
      } : null;
    }

  }

  return AtomClass;
};


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(4);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
    }

    // other module's atomAction
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    async get({ id, atomClassId, code }) {
      const data = id ? { id } : { atomClassId, code };
      const res = await this.model.get(data);
      if (res) return res;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAtomAction',
        data: { atomClassId, code },
      });
    }

    async getFlagByAtomId({ atomId, code, name }) {
      const atomClass = await ctx.meta.atomClass.getTopByAtomId({ atomId });
      const action = ctx.meta.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code, name });
      return action.flag.toString();
    }

    async register({ atomClassId, code }) {
      // get
      const res = await this.model.get({ atomClassId, code });
      if (res) return res;
      const atomClass = await ctx.meta.atomClass.get({ id: atomClassId });
      const action = ctx.meta.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code });
      const data = {
        atomClassId,
        code,
        name: action.name,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

  }

  return AtomAction;
};


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const mparse = require3('egg-born-mparse').default;
const modelAtomFn = __webpack_require__(5);
const modelAtomStarFn = __webpack_require__(6);
const modelAtomLabelFn = __webpack_require__(7);
const modelAtomLabelRefFn = __webpack_require__(8);
const sqlProcedureFn = __webpack_require__(9);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._atomClass = null;
      this._modelAtom = null;
      this._modelAtomStar = null;
      this._modelAtomLabel = null;
      this._modelAtomLabelRef = null;
      this._sequence = null;
      this._sqlProcedure = null;
    }

    // other module's atom
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get atomClass() {
      if (!this._atomClass) this._atomClass = ctx.meta.atomClass.module(this.moduleName);
      return this._atomClass;
    }

    get modelAtom() {
      if (!this._modelAtom) this._modelAtom = new (modelAtomFn(ctx.app))(ctx);
      return this._modelAtom;
    }

    get modelAtomStar() {
      if (!this._modelAtomStar) this._modelAtomStar = new (modelAtomStarFn(ctx.app))(ctx);
      return this._modelAtomStar;
    }

    get modelAtomLabel() {
      if (!this._modelAtomLabel) this._modelAtomLabel = new (modelAtomLabelFn(ctx.app))(ctx);
      return this._modelAtomLabel;
    }

    get modelAtomLabelRef() {
      if (!this._modelAtomLabelRef) this._modelAtomLabelRef = new (modelAtomLabelRefFn(ctx.app))(ctx);
      return this._modelAtomLabelRef;
    }

    get sequence() {
      if (!this._sequence) this._sequence = ctx.meta.sequence.module(moduleInfo.relativeName);
      return this._sequence;
    }

    get sqlProcedure() {
      if (!this._sqlProcedure) this._sqlProcedure = new (sqlProcedureFn(ctx))();
      return this._sqlProcedure;
    }

    async getAtomClassId({ module, atomClassName, atomClassIdParent = 0 }) {
      const res = await this.atomClass.get({
        module,
        atomClassName,
        atomClassIdParent,
      });
      return res.id;
    }

    // atom and item

    // create
    async create({ atomClass, roleIdOwner, item, user }) {
      // atomClass
      atomClass = await ctx.meta.atomClass.get(atomClass);
      // item
      item = item || { };
      if (!item.atomName) {
        // draftId
        const draftId = await this.sequence.next('draft');
        item.atomName = `${ctx.text('Draft')}-${draftId}`;
      }
      item.roleIdOwner = roleIdOwner;
      const atomId = await this._add({
        atomClass,
        atom: item,
        user,
      });

      // add item
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const res = await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/create`,
        body: {
          atomClass,
          roleIdOwner,
          key: { atomId },
          item,
          user,
        },
      });
      const itemId = res.itemId;

      // save itemId
      const atomFlow = item.atomFlow === undefined ? atomClass.flow : item.atomFlow;
      await this._update({
        atom: {
          id: atomId,
          itemId,
          atomName: item.atomName,
          atomFlow,
        },
        user,
      });

      return { atomId, itemId };
    }

    // read
    async read({ key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const _atomClass = await ctx.meta.atomClass.atomClass(atomClass);
      // get
      const item = await this._get({
        atom: {
          id: key.atomId,
          tableName: _atomClass.tableNameFull || _atomClass.tableName,
        },
        user,
      });
      if (!item) return null;

      // itemId
      key.itemId = item.id;

      // read item
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/read`,
        body: {
          atomClass,
          key,
          item,
          user,
        },
      });

      return item;
    }

    // count
    async count({ atomClass, options, user }) {
      return await this.select({ atomClass, options, user, count: 1 });
    }

    // select
    async select({ atomClass, options, user, pageForce = true, count = 0 }) {
      // atomClass
      let _atomClass;
      if (atomClass) {
        atomClass = await ctx.meta.atomClass.get(atomClass);
        _atomClass = await ctx.meta.atomClass.atomClass(atomClass);
      }
      // tableName
      let tableName = '';
      if (_atomClass) {
        tableName = this._getTableName({ atomClass: _atomClass, mode: options.mode });
        // 'where' should append atomClassId, such as article/post using the same table
        if (!options.where) options.where = {};
        options.where.atomClassId = atomClass.id;
      }
      // select
      const items = await this._list({
        tableName,
        options,
        user,
        pageForce,
        count,
      });

      // select items
      if (!count && atomClass) {
        const _moduleInfo = mparse.parseInfo(atomClass.module);
        await ctx.performAction({
          method: 'post',
          url: `/${_moduleInfo.url}/${atomClass.atomClassName}/select`,
          body: {
            atomClass,
            options,
            items,
            user,
          },
        });
      }

      return items;
    }

    // write
    async write({ key, item, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });

      // validator
      const validator = await ctx.meta.atom.validator({ atomClass, user });
      if (validator) {
        // if error throw 422
        await ctx.meta.validation.validate({
          module: validator.module,
          validator: validator.validator,
          schema: validator.schema,
          data: item,
        });
      }

      // write item
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/write`,
        body: {
          atomClass,
          key,
          item,
          user,
        },
      });

      // write atom only after item writed
      await this._writeAtom({ key, item, user });
    }

    async _writeAtom({ key, item, user }) {
      // write atom
      if (item) {
        const atom = { };
        if (item.atomName !== undefined) atom.atomName = item.atomName;
        if (item.allowComment !== undefined) atom.allowComment = item.allowComment;
        if (Object.keys(atom).length > 0) {
          atom.id = key.atomId;
          await this._update({
            atom,
            user,
          });
        }
      }
    }

    // delete
    async delete({ key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      // delete item
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/delete`,
        body: {
          atomClass,
          key,
          user,
        },
      });

      // delete atom and item
      await this._delete({
        atom: {
          id: key.atomId,
        },
        user,
      });
    }

    // action
    async action({ action, key, user }) {
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      return await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/action`,
        body: {
          action,
          atomClass,
          key,
          user,
        },
      });
    }

    async enable({ key, atom: { atomEnabled = 1 }, user }) {
      const _atom = await this.modelAtom.get({ id: key.atomId });
      if (_atom.atomEnabled === atomEnabled) return;
      // update
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomEnabled,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw.module(moduleInfo.relativeName, 1003);
      _atom.atomEnabled = atomEnabled;
      // enable item
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      await ctx.performAction({
        method: 'post',
        url: `/${_moduleInfo.url}/${atomClass.atomClassName}/enable`,
        body: {
          atomClass,
          key,
          atom: _atom,
          user,
        },
      });
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flag({ key, atom: { atomFlag }, user }) {
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomFlag,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw.module(moduleInfo.relativeName, 1003);
    }

    async flow({ key, atom: { atomFlow }, user }) {
      const res = await this.modelAtom.update({
        id: key.atomId,
        atomFlow,
        userIdUpdated: user.id,
      });
      if (res.affectedRows !== 1) ctx.throw.module(moduleInfo.relativeName, 1003);
    }

    async star({ key, atom: { star = 1 }, user }) {
      let diff = 0;
      // check if exists
      const _star = await this.modelAtomStar.get({
        userId: user.id,
        atomId: key.atomId,
      });
      if (_star && !star) {
        diff = -1;
        // delete
        await this.modelAtomStar.delete({
          id: _star.id,
        });
      } else if (!_star && star) {
        diff = 1;
        // new
        await this.modelAtomStar.insert({
          userId: user.id,
          atomId: key.atomId,
          star: 1,
        });
      }
      // get
      const atom = await this.get({ atomId: key.atomId });
      let starCount = atom.starCount;
      if (diff !== 0) {
        starCount += diff;
        await this.modelAtom.update({
          id: key.atomId,
          starCount,
          // userIdUpdated: user.id,
        });
      }
      // ok
      return { star, starCount };
    }

    async readCount({ key, atom: { readCount = 1 }, user }) {
      await this.modelAtom.query('update aAtom set readCount = readCount + ? where iid=? and id=?',
        [ readCount, ctx.instance.id, key.atomId ]);
    }

    async comment({ key, atom: { comment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set commentCount = commentCount + ? where iid=? and id=?',
        [ comment, ctx.instance.id, key.atomId ]);
    }

    async attachment({ key, atom: { attachment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set attachmentCount = attachmentCount + ? where iid=? and id=?',
        [ attachment, ctx.instance.id, key.atomId ]);
    }

    async labels({ key, atom: { labels = null }, user }) {
      // force delete
      await this.modelAtomLabel.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      await this.modelAtomLabelRef.delete({
        userId: user.id,
        atomId: key.atomId,
      });
      // new
      if (labels && labels.length > 0) {
        await this.modelAtomLabel.insert({
          userId: user.id,
          atomId: key.atomId,
          labels: JSON.stringify(labels),
        });
        for (const labelId of labels) {
          await this.modelAtomLabelRef.insert({
            userId: user.id,
            atomId: key.atomId,
            labelId,
          });
        }
      }
    }

    async actions({ key, basic, user }) {
      // atomClass
      const atomClass = await ctx.meta.atomClass.getByAtomId({ atomId: key.atomId });
      // actions
      const _basic = basic ? 'and a.code<100' : '';
      const sql = `
        select a.*,b.module,b.atomClassName from aAtomAction a
          left join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.deleted=0 and a.atomClassId=? ${_basic}
              order by a.code asc
      `;
      const actions = await ctx.model.query(sql, [ ctx.instance.id, atomClass.id ]);
      // actions res
      const actionsRes = [];
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      for (const action of actions) {
        if (action.code === _actionsSystem.write || action.code === _actionsSystem.delete) {
          const res = await this.checkRightUpdate({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        } else if (action.code > _actionsSystem.custom) {
          const res = await this.checkRightAction({ atom: { id: key.atomId, action: action.code }, user });
          if (res) actionsRes.push(action);
        }
      }
      return actionsRes;
    }

    async schema({ atomClass, schema, user }) {
      const validator = await this.validator({ atomClass, user });
      if (!validator) return null;
      const _schema = ctx.meta.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
      return {
        module: validator.module,
        validator: validator.validator,
        schema: _schema,
      };
    }

    async validator({ atomClass: { id }, user }) {
      let atomClass = await this.atomClass.get({ id });
      atomClass = await this.atomClass.top(atomClass);
      return await this.atomClass.validator({ atomClass, user });
    }

    // atom

    async _add({
      atomClass: { id, atomClassName, atomClassIdParent = 0 },
      atom: { itemId, atomName, atomFlag = 0, atomFlow = 0, roleIdOwner = 0 },
      user,
    }) {
      let atomClassId = id;
      if (!atomClassId) atomClassId = await this.getAtomClassId({ atomClassName, atomClassIdParent });
      const res = await this.modelAtom.insert({
        atomEnabled: 0, // must be enabled by enable
        atomFlag,
        atomFlow,
        itemId,
        atomClassId,
        atomName,
        userIdCreated: user.id,
        userIdUpdated: user.id,
        roleIdOwner,
      });
      return res.insertId;
    }

    async _update({
      atom: { id, atomName, allowComment, atomFlow, itemId },
      user,
    }) {
      const params = { id, userIdUpdated: user.id };
      if (atomName !== undefined) params.atomName = atomName;
      if (allowComment !== undefined) params.allowComment = allowComment;
      if (atomFlow !== undefined) params.atomFlow = atomFlow;
      if (itemId !== undefined) params.itemId = itemId;
      params.updatedAt = new Date();
      const res = await this.modelAtom.update(params);
      if (res.affectedRows !== 1) ctx.throw.module(moduleInfo.relativeName, 1003);
    }

    async _delete({
      atom,
      user,
    }) {
      await this._update({ atom, user });
      await this.modelAtom.delete(atom);
    }

    async _get({
      atom: { id, tableName },
      user,
    }) {
      const sql = this.sqlProcedure.getAtom({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, atomId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async _list({ tableName, options: { where, orders, page, star = 0, label = 0, comment = 0, file = 0 }, user, pageForce = true, count = 0 }) {
      page = ctx.meta.util.page(page, pageForce);

      const sql = this.sqlProcedure.selectAtoms({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        tableName, where, orders, page,
        star, label, comment, file, count,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    // right

    async checkRoleRightRead({
      atom: { id },
      roleId,
    }) {
      const res = await ctx.model.query('call aCheckRoleRightRead(?,?,?)',
        [ ctx.instance.id, roleId, id ]
      );
      return res[0][0];
    }

    async checkRightRead({
      atom: { id },
      user,
    }) {
      const sql = this.sqlProcedure.checkRightRead({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightUpdate({
      atom: { id, action },
      user,
    }) {
      const actionFlag = await ctx.meta.atomAction.getFlagByAtomId({ atomId: id, code: action });
      const sql = this.sqlProcedure.checkRightUpdate({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action, actionFlag,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightAction({
      atom: { id, action },
      user,
    }) {
      const actionFlag = await ctx.meta.atomAction.getFlagByAtomId({ atomId: id, code: action });
      const sql = this.sqlProcedure.checkRightAction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomId: id,
        action, actionFlag,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightCreate({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      user,
    }) {
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightCreate({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
      });
      return await ctx.model.queryOne(sql);
    }

    async checkRightCreateRole({
      atomClass: { id, module, atomClassName, atomClassIdParent = 0 },
      roleIdOwner,
      user,
    }) {
      if (!roleIdOwner) return null;
      if (!id) id = await this.getAtomClassId({ module, atomClassName, atomClassIdParent });
      const sql = this.sqlProcedure.checkRightCreateRole({
        iid: ctx.instance.id,
        userIdWho: user.id,
        atomClassId: id,
        roleIdOwner,
      });
      return await ctx.model.queryOne(sql);
    }

    // preffered roles
    async preferredRoles({ atomClass, user }) {
      // atomClass
      atomClass = await ctx.meta.atomClass.get(atomClass);

      const roles = await ctx.model.query(
        `select a.*,b.userId,c.roleName as roleNameWho from aViewRoleRightAtomClass a
          inner join aUserRole b on a.roleIdWho=b.roleId
          left join aRole c on a.roleIdWho=c.id
          where a.iid=? and a.atomClassId=? and a.action=1 and b.userId=?
          order by a.roleIdWho desc`,
        [ ctx.instance.id, atomClass.id, user.id ]);
      return roles;
    }

    _upperCaseFirstChar(str) {
      if (!str) return '';
      return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    _getTableName({ atomClass, mode }) {
      mode = this._upperCaseFirstChar(mode);
      if (mode === 'Search') {
        return atomClass.tableNameSearch || atomClass.tableNameFull || atomClass.tableName;
      }
      // special: all = list + atomEnabled=0
      return atomClass[`tableName${mode}`] || atomClass.tableName;
    }

  }

  return Atom;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(2);
const modelFunctionStarFn = __webpack_require__(10);
const modelFunctionLocaleFn = __webpack_require__(11);
const modelFunctionSceneFn = __webpack_require__(12);
const sqlProcedureFn = __webpack_require__(9);

const __cacheSetLocalesStartup = '__setLocalesStartup';

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Function {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelFunctionStar = null;
      this._modelFunctionLocale = null;
      this._modelFunctionScene = null;
      this._sqlProcedure = null;
    }

    // other module's menu
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelFunctionStar() {
      if (!this._modelFunctionStar) this._modelFunctionStar = new (modelFunctionStarFn(ctx.app))(ctx);
      return this._modelFunctionStar;
    }

    get modelFunctionLocale() {
      if (!this._modelFunctionLocale) this._modelFunctionLocale = new (modelFunctionLocaleFn(ctx.app))(ctx);
      return this._modelFunctionLocale;
    }

    get modelFunctionScene() {
      if (!this._modelFunctionScene) this._modelFunctionScene = new (modelFunctionSceneFn(ctx.app))(ctx);
      return this._modelFunctionScene;
    }

    get sqlProcedure() {
      if (!this._sqlProcedure) this._sqlProcedure = new (sqlProcedureFn(ctx))();
      return this._sqlProcedure;
    }

    // list
    //   locale maybe '' for selectAllFunctions beside menus
    async list({ options: { where, orders, page, star = 0, locale = '' }, user }) {
      // page = ctx.meta.util.page(page); // has set in controller

      // sql
      const sql = this.sqlProcedure.selectFunctions({
        iid: ctx.instance.id,
        locale,
        userIdWho: user.id,
        where, orders, page, star,
      });
      // select
      return await ctx.model.query(sql);
    }

    async star({ id, star = 1, user }) {
      // force delete
      await this.modelFunctionStar.delete({
        userId: user.id,
        functionId: id,
      });
      // new
      if (star) {
        await this.modelFunctionStar.insert({
          userId: user.id,
          functionId: id,
          star: 1,
        });
      }
    }

    async check({ functions, user }) {
      for (const func of functions) {
        const res = await this.checkRightFunction({ function: func, user });
        if (res) {
          func.passed = true;
          func.id = res.id;
        } else {
          func.passed = false;
        }
      }
      return functions;
    }

    async scenesArray({ sceneMenu }) {
      const list = await this.modelFunctionScene.select({
        where: { sceneMenu },
        orders: [[ 'sceneSorting', 'asc' ]],
      });
      for (const item of list) {
        const sceneName = item.sceneName;
        item.title = sceneName.replace(sceneName[0], sceneName[0].toUpperCase());
        item.titleLocale = ctx.text(item.title);
      }
      return list;
    }

    async scenes({ sceneMenu }) {
      const list = await this.scenesArray({ sceneMenu });
      const scenes = {};
      for (const item of list) {
        scenes[item.id] = item;
      }
      return scenes;
    }

    //

    async delete({ id, module, name }) {
      if (id) {
        await this.model.delete({ id });
      } else {
        module = module || this.moduleName;
        await this.model.delete({ module, name });
      }
    }

    async _get({ id, module, name }) {
      if (id) return await this.model.get({ id });
      module = module || this.moduleName;
      return await this.model.get({ module, name });
    }

    async get({ id, module, name }) {
      module = module || this.moduleName;
      const res = await this._get({ id, module, name });
      if (res) return res;
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerFunction',
        data: { module, name },
      });
    }

    // iid maybe undefined
    async getSceneId({ sceneName, sceneMenu }) {
      const sceneItem = await this.modelFunctionScene.get({ sceneName, sceneMenu });
      if (sceneItem) return sceneItem.id;
      // scene sorting
      const scenes = (ctx.config.module(moduleInfo.relativeName).function.scenes[sceneMenu] || '').split(',');
      const sceneSorting = scenes.indexOf(sceneName) + 1;
      const res = await this.modelFunctionScene.insert({
        sceneName,
        sceneMenu,
        sceneSorting,
      });
      return res.insertId;
    }

    async register({ module, name }) {
      module = module || this.moduleName;
      // get
      const res = await this.model.get({ module, name });
      if (res) return res;
      const func = ctx.meta.base.function({ module, name });
      if (!func) throw new Error(`function not found: ${module}:${name}`);
      // atomClassId
      let atomClassId = 0;
      if (func.atomClassName) {
        const atomClass = await ctx.meta.atomClass.get({ module, atomClassName: func.atomClassName });
        atomClassId = atomClass.id;
      }
      // sceneId
      let sceneId;
      const sceneName = func.scene;
      if (!sceneName) {
        sceneId = 0;
      } else {
        sceneId = await this.getSceneId({ sceneName, sceneMenu: func.menu });
      }
      // insert
      const data = {
        module,
        name: func.name,
        title: func.title,
        sceneId,
        autoRight: func.autoRight,
        atomClassId,
        action: func.action ? ctx.constant.module(moduleInfo.relativeName).atom.action[func.action] : 0,
        sorting: func.sorting,
        menu: func.menu,
        public: func.public,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async checkRightFunction({
      function: { module, name },
      user,
    }) {
      const func = await this.get({ module, name });
      const sql = this.sqlProcedure.checkRightFunction({
        iid: ctx.instance.id,
        userIdWho: user.id,
        functionId: func.id,
      });
      return await ctx.model.queryOne(sql);
    }

    async _checkFunctionLocales({ locale }) {
      locale = locale || ctx.locale;
      const sql = this.sqlProcedure.checkFunctionLocales({
        iid: ctx.instance.id,
        locale,
      });
      return await ctx.model.query(sql);
    }

    async _setLocale({ locale, reset }) {
      let functions;
      // functions
      if (reset) {
        functions = await this.model.select();
      } else {
        functions = await this._checkFunctionLocales({ locale });
      }
      if (functions.length === 0) return;
      // insert locales
      for (const func of functions) {
        // title
        const funcBase = ctx.meta.base.function({ module: func.module, name: func.name });
        if (!funcBase) throw new Error(`function not found: ${func.module}:${func.name}`);
        if (func.title !== funcBase.title) {
          await this.model.update({ id: func.id, title: funcBase.title });
        }
        // titleLocale
        const titleLocale = ctx.text.locale(locale, funcBase.title);
        await this.modelFunctionLocale.insert({
          functionId: func.id, locale, titleLocale,
        });
      }
    }

    async setLocales(options) {
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'setFunctionLocales',
        data: { options },
      });
    }

    async setLocalesQueue(options) {
      options = options || {};
      const reset = options.reset;
      // check cache
      if (reset && !ctx.app.meta.isTest) {
        const cache = ctx.cache.db.module(moduleInfo.relativeName);
        const flag = await cache.get(__cacheSetLocalesStartup);
        if (flag) return;
        // set
        await cache.set(__cacheSetLocalesStartup, true, ctx.app.config.queue.startup.debounce);
      }
      // clear
      if (reset) {
        await this.clearLocales();
      }
      // setLocales
      const locales = ctx.config.module(moduleInfo.relativeName).locales;
      for (const locale in locales) {
        await this._setLocale({ locale, reset });
      }
    }

    async clearLocales() {
      await this.modelFunctionLocale.delete();
    }

  }

  return Function;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

const modelFn = __webpack_require__(13);
const modelRoleIncFn = __webpack_require__(14);
const modelUserRoleFn = __webpack_require__(15);
const modelRoleRightFn = __webpack_require__(16);
const modelRoleRightRefFn = __webpack_require__(17);
const modelFunctionFn = __webpack_require__(2);
const modelRoleFunctionFn = __webpack_require__(18);

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Role {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
      this._modelRoleInc = null;
      this._modelUserRole = null;
      this._modelRoleRight = null;
      this._modelRoleRightRef = null;
      this._modelFunction = null;
      this._modelRoleFunction = null;
    }

    // other module's role
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    get modelRoleInc() {
      if (!this._modelRoleInc) this._modelRoleInc = new (modelRoleIncFn(ctx.app))(ctx);
      return this._modelRoleInc;
    }

    get modelUserRole() {
      if (!this._modelUserRole) this._modelUserRole = new (modelUserRoleFn(ctx.app))(ctx);
      return this._modelUserRole;
    }

    get modelRoleRight() {
      if (!this._modelRoleRight) this._modelRoleRight = new (modelRoleRightFn(ctx.app))(ctx);
      return this._modelRoleRight;
    }

    get modelRoleRightRef() {
      if (!this._modelRoleRightRef) this._modelRoleRightRef = new (modelRoleRightRefFn(ctx.app))(ctx);
      return this._modelRoleRightRef;
    }

    get modelFunction() {
      if (!this._modelFunction) this._modelFunction = new (modelFunctionFn(ctx.app))(ctx);
      return this._modelFunction;
    }

    get modelRoleFunction() {
      if (!this._modelRoleFunction) this._modelRoleFunction = new (modelRoleFunctionFn(ctx.app))(ctx);
      return this._modelRoleFunction;
    }

    async get(where) {
      return await this.model.get(where);
    }

    async getSystemRole({ roleName }) {
      return await this.get({
        roleName,
        system: 1,
      });
    }

    // add role
    async add({ roleName = '', leader = 0, catalog = 0, system = 0, sorting = 0, roleIdParent = 0 }) {
      const res = await this.model.insert({
        roleName,
        leader,
        catalog,
        system,
        sorting,
        roleIdParent,
      });
      const roleId = res.insertId;

      // set dirty
      await this.setDirty(true);

      return roleId;
    }

    async move({ roleId, roleIdParent }) {
      // role
      const role = await this.get({ id: roleId });
      if (role.roleIdParent === roleIdParent) return;

      // update
      await this.model.update({ id: roleId, roleIdParent });

      // set dirty
      await this.setDirty(true);
    }

    async delete({ roleId }) {
      // role
      const role = await this.get({ id: roleId });

      // check if system
      if (role.system) ctx.throw(403);
      // check if children
      if (role.catalog) {
        const children = await this.children({ roleId });
        if (children.length > 0) ctx.throw.module(moduleInfo.relativeName, 1008);
      }

      // delete all includes
      await this.modelRoleInc.delete({ roleId });
      await this.modelRoleInc.delete({ roleIdInc: roleId });

      // delete all users
      await this.modelUserRole.delete({ roleId });

      // delete all atom rights
      await this.modelRoleRight.delete({ roleId });
      await this.modelRoleRightRef.delete({ roleId });

      // delete all function rights
      await this.modelRoleFunction.delete({ roleId });

      // delete this
      await this.model.delete({ id: roleId });

      // set dirty
      await this.setDirty(true);
    }

    // add role include
    async addRoleInc({ roleId, roleIdInc }) {
      const res = await this.modelRoleInc.insert({
        roleId,
        roleIdInc,
      });
      const id = res.insertId;

      // set dirty
      await this.setDirty(true);

      return id;
    }

    // remove role include
    async removeRoleInc({ id }) {
      await this.modelRoleInc.delete({ id });

      // set dirty
      await this.setDirty(true);
    }

    // add user role
    async addUserRole({ userId, roleId }) {
      const res = await this.modelUserRole.insert({
        userId, roleId,
      });
      return res.insertId;
    }

    async deleteUserRole({ id, userId, roleId }) {
      if (!id) {
        const item = await this.modelUserRole.get({
          userId, roleId,
        });
        if (!item) return;
        id = item.id;
      }
      await this.modelUserRole.delete({ id });
    }

    async deleteAllUserRoles({ userId }) {
      await this.modelUserRole.delete({ userId });
    }

    // add role right
    async addRoleRight({ roleId, atomClassId, action, scope }) {
      if (scope) {
        if (typeof scope === 'string') {
          scope = scope.split(',');
        } else if (!Array.isArray(scope)) {
          scope = [ scope ];
        }
      }
      // force action exists in db
      await ctx.meta.atomAction.get({ atomClassId, code: action });

      // roleRight
      const res = await this.modelRoleRight.insert({
        roleId,
        atomClassId,
        action,
        scope: JSON.stringify(scope),
      });
      const roleRightId = res.insertId;
      // roleRightRef
      if (scope) {
        for (const roleIdScope of scope) {
          await this.modelRoleRightRef.insert({
            roleRightId,
            roleId,
            atomClassId,
            action,
            roleIdScope,
          });
        }
      }
      // insert into roleFunction if action=create/read
      const constant = ctx.constant.module(moduleInfo.relativeName);
      if (action === constant.atom.action.create || action === constant.atom.action.read) {
        const atomClass = await ctx.meta.atomClass.get({ id: atomClassId });
        const functions = ctx.meta.base.functionsAutoRight({
          module: atomClass.module,
          atomClassName: atomClass.atomClassName,
          action });
        for (const key in functions) {
          const func = await ctx.meta.function.get({ module: atomClass.module, name: functions[key].name });
          await this.addRoleFunction({
            roleId,
            functionId: func.id,
            roleRightId,
          });
        }
      }

      return roleRightId;
    }

    // delete role right
    async deleteRoleRight({ id }) {
      await this.modelRoleRight.delete({ id });
      await this.modelRoleRightRef.delete({ roleRightId: id });
      await this.modelRoleFunction.delete({ roleRightId: id });
    }

    // add role function
    async addRoleFunction({ roleId, functionId, roleRightId = 0 }) {
      await this.modelRoleFunction.insert({
        roleId,
        functionId,
        roleRightId,
      });
    }

    // delete role function
    async deleteRoleFunction({ id }) {
      await this.modelRoleFunction.delete({ id });
    }

    // children
    async children({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      // roleId
      if (!roleId || roleId === 'root') {
        roleId = 0;
      }
      // select
      const options = {
        where: { roleIdParent: roleId },
        orders: [[ 'sorting', 'asc' ], [ 'roleName', 'asc' ]],
      };
      if (page.size !== 0) {
        options.limit = page.size;
        options.offset = page.index;
      }
      return await this.model.select(options);
    }

    // save
    async save({ roleId, data: { roleName, leader, sorting } }) {
      const role = await this.get({ id: roleId });
      role.roleName = roleName;
      role.leader = leader;
      role.sorting = sorting;
      await this.model.update(role);
    }

    // includes
    async includes({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      return await ctx.model.query(`
        select a.*,b.roleName from aRoleInc a
          left join aRole b on a.roleIdInc=b.id
            where a.iid=? and a.roleId=?
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
    }

    // role rights
    async roleRights({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.atomClassName,c.name as actionName from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
            where a.iid=? and a.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // role spreads
    async roleSpreads({ roleId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select d.*,d.id as roleExpandId,a.id as roleRightId,a.scope,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,e.roleName from aRoleRight a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRoleExpand d on a.roleId=d.roleIdBase
          left join aRole e on d.roleIdBase=e.id
            where d.iid=? and d.roleId=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, roleId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    // atom rights of user
    async atomRightsOfUser({ userId, page }) {
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.atomClassName,c.code as actionCode,c.name as actionName,e.roleName from aViewUserRightAtomClass a
          left join aAtomClass b on a.atomClassId=b.id
          left join aAtomAction c on a.atomClassId=c.atomClassId and a.action=c.code
          left join aRole e on a.roleIdBase=e.id
            where a.iid=? and a.userIdWho=?
            order by b.module,a.atomClassId,a.action
            ${_limit}
        `, [ ctx.instance.id, userId ]);
      // scope
      for (const item of list) {
        const scope = JSON.parse(item.scope);
        item.scopeRoles = await this._scopeRoles({ scope });
      }
      return list;
    }

    async _scopeRoles({ scope }) {
      if (!scope || scope.length === 0) return null;
      return await ctx.model.query(`
            select a.* from aRole a
              where a.iid=? and a.id in (${scope.join(',')})
            `, [ ctx.instance.id ]);
    }

    // function rights
    async functionRights({ menu, roleId, page }) {
      // check locale
      const locale = ctx.locale;
      // list
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.name,b.title,b.sceneId,g.sceneName,b.sorting,f.titleLocale from aRoleFunction a
          left join aFunction b on a.functionId=b.id
          left join aFunctionLocale f on a.functionId=f.functionId
          left join aFunctionScene g on g.id=b.sceneId
            where a.iid=? and a.roleId=? and b.menu=? and f.locale=?
            order by b.module,g.sceneSorting,b.sorting
            ${_limit}
        `, [ ctx.instance.id, roleId, menu, locale ]);
      return list;
    }

    // function spreads
    async functionSpreads({ menu, roleId, page }) {
      // check locale
      const locale = ctx.locale;
      // list
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select d.*,d.id as roleExpandId,a.id as roleFunctionId,b.module,b.name,b.title,b.sceneId,g.sceneName,e.roleName,f.titleLocale from aRoleFunction a
          left join aFunction b on a.functionId=b.id
          left join aRoleExpand d on a.roleId=d.roleIdBase
          left join aRole e on d.roleIdBase=e.id
          left join aFunctionLocale f on a.functionId=f.functionId
          left join aFunctionScene g on g.id=b.sceneId
            where d.iid=? and d.roleId=? and b.menu=? and f.locale=?
            order by b.module,g.sceneSorting,b.sorting
            ${_limit}
        `, [ ctx.instance.id, roleId, menu, locale ]);
      return list;
    }

    // function rights of user
    async functionRightsOfUser({ menu, userId, page }) {
      // check locale
      const locale = ctx.locale;
      // list
      page = ctx.meta.util.page(page, false);
      const _limit = ctx.model._limit(page.size, page.index);
      const list = await ctx.model.query(`
        select a.*,b.module,b.name,b.title,b.sceneId,g.sceneName,b.sorting,f.titleLocale,e.roleName from aViewUserRightFunction a
          left join aFunction b on a.functionId=b.id
          left join aFunctionLocale f on a.functionId=f.functionId
          left join aFunctionScene g on g.id=b.sceneId
          left join aRole e on a.roleIdBase=e.id
            where a.iid=? and a.userIdWho=? and b.menu=? and f.locale=?
            order by b.module,g.sceneSorting,b.sorting
            ${_limit}
        `, [ ctx.instance.id, userId, menu, locale ]);

      return list;
    }

    async getUserRolesDirect({ userId }) {
      const list = await ctx.model.query(`
        select a.* from aRole a
          left join aUserRole b on a.id=b.roleId
            where a.iid=? and b.userId=?
        `, [ ctx.instance.id, userId ]);
      return list;
    }

    async getUserRolesParent({ userId }) {
      const list = await ctx.model.query(`
        select a.* from aRole a
          left join aViewUserRoleRef b on a.id=b.roleIdParent
            where a.iid=? and b.userId=?
        `, [ ctx.instance.id, userId ]);
      return list;
    }

    async getUserRolesExpand({ userId }) {
      const list = await ctx.model.query(`
        select a.* from aRole a
          left join aViewUserRoleExpand b on a.id=b.roleIdBase
            where a.iid=? and b.userId=?
        `, [ ctx.instance.id, userId ]);
      return list;
    }

    async userInRoleDirect({ userId, roleId }) {
      const list = await ctx.model.query(`
        select count(*) as count from aUserRole a
          where a.iid=? and a.userId=? and a.roleId=?
        `, [ ctx.instance.id, userId, roleId ]);
      return list[0].count > 0;
    }

    async userInRoleParent({ userId, roleId }) {
      const list = await ctx.model.query(`
        select count(*) as count from aViewUserRoleRef a
          where a.iid=? and a.userId=? and a.roleIdParent=?
        `, [ ctx.instance.id, userId, roleId ]);
      return list[0].count > 0;
    }

    async userInRoleExpand({ userId, roleId }) {
      const list = await ctx.model.query(`
        select count(*) as count from aViewUserRoleExpand a
          where a.iid=? and a.userId=? and a.roleIdBase=?
        `, [ ctx.instance.id, userId, roleId ]);
      return list[0].count > 0;
    }

    // set dirty
    async setDirty(dirty) {
      await ctx.meta.status.module(moduleInfo.relativeName).set('roleDirty', dirty);
    }

    async getDirty() {
      return await ctx.meta.status.module(moduleInfo.relativeName).get('roleDirty');
    }

    // build roles
    async build(options) {
      options = options || {};
      const progressId = options.progressId;
      // total
      let total;
      if (progressId) {
        total = await this.model.count();
      }
      // progress
      const progress = { progressId, total, progress: 0 };
      try {
        // iid
        const iid = ctx.instance.id;
        // remove
        await this._buildRolesRemove({ iid });
        // add
        await this._buildRolesAdd({ iid, roleIdParent: 0 }, progress);
        // setDirty
        await this.setDirty(false);
        // done
        if (progressId) {
          await ctx.meta.progress.done({ progressId });
        }
      } catch (err) {
        // error
        if (progressId) {
          await ctx.meta.progress.error({ progressId, message: err.message });
        }
        throw err;
      }
    }

    // const roleRights = [
    //   { roleName: 'cms-writer', action: 'create' },
    //   { roleName: 'cms-writer', action: 'write', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'delete', scopeNames: 0 },
    //   { roleName: 'cms-writer', action: 'read', scopeNames: 'authenticated' },
    //   { roleName: 'cms-publisher', action: 'read', scopeNames: 'authenticated' },
    //   { roleName: 'cms-publisher', action: 'write', scopeNames: 'authenticated' },
    //   { roleName: 'cms-publisher', action: 'publish', scopeNames: 'authenticated' },
    //   { roleName: 'root', action: 'read', scopeNames: 'authenticated' },
    // ];
    async addRoleRightBatch({ module, atomClassName, atomClassIdParent = 0, roleRights }) {
      // module
      module = module || this.moduleName;
      const _module = ctx.app.meta.modules[module];
      // atomClass
      const atomClass = await ctx.meta.atomClass.get({ module, atomClassName, atomClassIdParent });
      // roleRights
      if (!roleRights || !roleRights.length) return;
      for (const roleRight of roleRights) {
        // role
        const role = await this.get({ roleName: roleRight.roleName });
        // scope
        let scope;
        if (!roleRight.scopeNames) {
          scope = 0;
        } else {
          scope = [];
          const scopeNames = Array.isArray(roleRight.scopeNames) ? roleRight.scopeNames : roleRight.scopeNames.split(',');
          for (const scopeName of scopeNames) {
            const roleScope = await this.get({ roleName: scopeName });
            scope.push(roleScope.id);
          }
        }
        // add role right
        await this.addRoleRight({
          roleId: role.id,
          atomClassId: atomClass.id,
          action: ctx.constant.module('a-base').atom.action[roleRight.action] || _module.main.meta.base.atoms[atomClassName]
            .actions[roleRight.action].code,
          scope,
        });
      }
    }

    // const roleFunctions = [
    //   { roleName: 'root', name: 'listComment' },
    // ];
    async addRoleFunctionBatch({ module, roleFunctions }) {
      if (!roleFunctions || !roleFunctions.length) return;
      module = module || this.moduleName;
      for (const roleFunction of roleFunctions) {
        // func
        const func = await ctx.meta.function.get({ module, name: roleFunction.name });
        if (roleFunction.roleName) {
          // role
          const role = await this.get({ roleName: roleFunction.roleName });
          // add role function
          await this.addRoleFunction({
            roleId: role.id,
            functionId: func.id,
          });
        }
      }
    }

    async _buildRolesRemove({ iid }) {
      await ctx.model.query(`delete from aRoleRef where aRoleRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleIncRef where aRoleIncRef.iid=${iid}`);
      await ctx.model.query(`delete from aRoleExpand where aRoleExpand.iid=${iid}`);
    }

    async _buildRolesAdd({ iid, roleIdParent }, progress) {
      const list = await ctx.model.query(
        `select a.id,a.roleName,a.catalog from aRole a where a.iid=${iid} and a.roleIdParent=${roleIdParent}`
      );
      for (const item of list) {
        // info
        const roleId = item.id;
        const catalog = item.catalog;
        // build
        await this._buildRoleRef({ iid, roleId });
        await this._buildRoleIncRef({ iid, roleId });
        await this._buildRoleExpand({ iid, roleId });
        // catalog
        if (catalog === 1) {
          await this._buildRolesAdd({ iid, roleIdParent: roleId }, progress);
        }
        // progress
        if (progress.progressId) {
          await ctx.meta.progress.update({
            progressId: progress.progressId, progressNo: 0,
            total: progress.total, progress: progress.progress++,
            text: item.roleName,
          });
        }
      }
    }

    async _buildRoleRef({ iid, roleId }) {
      let level = 0;
      let roleIdParent = roleId;
      // loop
      while (level !== -1) {
        await ctx.model.query(
          `insert into aRoleRef(iid,roleId,roleIdParent,level)
             values(${iid},${roleId},${roleIdParent},${level})
          `
        );
        const item = await ctx.model.queryOne(
          `select a.roleIdParent from aRole a where a.iid=${iid} and a.id=${roleIdParent}`
        );
        if (!item || !item.roleIdParent) {
          level = -1;
        } else {
          roleIdParent = item.roleIdParent;
          level++;
        }
      }
    }

    async _buildRoleIncRef({ iid, roleId }) {
      await ctx.model.query(
        `insert into aRoleIncRef(iid,roleId,roleIdInc,roleIdSrc)
            select ${iid},${roleId},a.roleIdInc,a.roleId from aRoleInc a
              where a.iid=${iid} and a.roleId in (select b.roleIdParent from aRoleRef b where b.iid=${iid} and b.roleId=${roleId})
        `);
    }

    async _buildRoleExpand({ iid, roleId }) {
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleId,roleIdBase)
            select a.iid,a.roleId,a.roleIdParent from aRoleRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `);
      await ctx.model.query(
        `insert into aRoleExpand(iid,roleId,roleIdBase)
            select a.iid,a.roleId,a.roleIdInc from aRoleIncRef a
              where a.iid=${iid} and a.roleId=${roleId}
        `);
    }

  }

  return Role;
};


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = ctx => {

  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  class Auth {
    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      try {
        if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent) {
          // anonymous
          await ctx.meta.user.loginAsAnonymous();
        } else {
          // check if deleted,disabled,agent
          await ctx.meta.user.check();
        }
        // logined
        return await this.getLoginInfo();
      } catch (e) {
        // deleted,disabled
        return await this.logout();
      }
    }

    async check() {
      return await this.getLoginInfo();
    }

    async logout() {
      await ctx.logout();
      await ctx.meta.user.loginAsAnonymous();
      return await this.getLoginInfo();
    }

    async getLoginInfo() {
      const config = await this._getConfig();
      const info = {
        user: ctx.user,
        instance: this._getInstance(),
        config,
      };
      // login info event
      await ctx.meta.event.invoke({
        name: 'loginInfo', data: { info },
      });
      return info;
    }

    _getInstance() {
      return {
        name: ctx.instance.name,
        title: ctx.instance.title,
      };
    }

    async _getConfig() {
      // config
      const config = {
        modules: {
          'a-base': {
            account: this._getAccount(),
          },
        },
      };
      // theme
      const themeStatus = `user-theme:${ctx.user.agent.id}`;
      const theme = await ctx.meta.status.module('a-user').get(themeStatus);
      if (theme) {
        config.theme = theme;
      }
      // ok
      return config;
    }

    _getAccount() {
      // account
      const account = extend(true, {}, ctx.config.module(moduleInfo.relativeName).account);
      account.activatedRoles = undefined;
      // url
      for (const key in account.activationProviders) {
        const relativeName = account.activationProviders[key];
        if (relativeName) {
          const moduleConfig = ctx.config.module(relativeName);
          extend(true, account.url, moduleConfig.account.url);
        }
      }
      return account;
    }

  }

  return Auth;
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function auth(ctx, next) {
    // always has anonymous id
    ctx.meta.user.anonymousId();
    // check
    if (!ctx.isAuthenticated() || !ctx.user.op || !ctx.user.agent || ctx.user.op.iid !== ctx.instance.id) {
      // anonymous
      await ctx.meta.user.loginAsAnonymous();
    } else {
      // check if deleted,disabled,agent
      await ctx.meta.user.check();
    }

    // if user
    if (options.user && ctx.user.op.anonymous) ctx.throw(401);

    // next
    await next();
  };
};


/***/ }),
/* 45 */
/***/ (function(module, exports) {

// request.body
//   key: atomId itemId
//   atomClass: id,module,atomClassName,atomClassIdParent
//   item:
// options
//   type: atom/function
//   action(atom):
//   name(function):
//   module:
module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function right(ctx, next) {
    // ignore
    if (!options.type) return await next();

    // atom
    if (options.type === 'atom') await checkAtom(moduleInfo, options, ctx);

    // function
    if (options.type === 'function') await checkFunction(moduleInfo, options, ctx);

    // next
    await next();
  };
};

async function checkAtom(moduleInfo, options, ctx) {
  // constant
  const constant = ctx.constant.module(moduleInfo.relativeName);

  // create
  if (options.action === constant.atom.action.create) {
    // atomClassId
    let atomClassId = ctx.request.body.atomClass.id;
    if (!atomClassId) {
      const res = await ctx.meta.atomClass.get({
        module: ctx.request.body.atomClass.module,
        atomClassName: ctx.request.body.atomClass.atomClassName,
        atomClassIdParent: ctx.request.body.atomClass.atomClassIdParent || 0,
      });
      atomClassId = res.id;
    }
    // roleIdOwner
    const roleIdOwner = ctx.request.body.roleIdOwner;
    if (roleIdOwner) {
      // check
      const res = await ctx.meta.atom.checkRightCreateRole({
        atomClass: {
          id: atomClassId,
        },
        roleIdOwner,
        user: ctx.user.op,
      });
      if (!res) ctx.throw(403);
      ctx.meta._atomClass = res;
    } else {
      // retrieve default one
      const roles = await ctx.meta.atom.preferredRoles({
        atomClass: {
          id: atomClassId,
        },
        user: ctx.user.op,
      });
      if (roles.length === 0) ctx.throw(403);
      ctx.request.body.roleIdOwner = roles[0].roleIdWho;
      ctx.meta._atomClass = { id: atomClassId };
    }

  }

  // read
  if (options.action === constant.atom.action.read) {
    const res = await ctx.meta.atom.checkRightRead({
      atom: { id: ctx.request.body.key.atomId },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.meta._atom = res;
  }

  // write/delete
  if (options.action === constant.atom.action.write || options.action === constant.atom.action.delete) {
    const res = await ctx.meta.atom.checkRightUpdate({
      atom: { id: ctx.request.body.key.atomId, action: options.action },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.meta._atom = res;
  }

  // other action
  const actionCustom = options.action || ctx.request.body.action;
  if (actionCustom > constant.atom.action.custom) {
    const res = await ctx.meta.atom.checkRightAction({
      atom: { id: ctx.request.body.key.atomId, action: actionCustom },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.meta._atom = res;
  }

}

async function checkFunction(moduleInfo, options, ctx) {
  if (ctx.innerAccess) return;
  const res = await ctx.meta.function.checkRightFunction({
    function: {
      module: options.module || ctx.module.info.relativeName,
      name: options.name || ctx.request.body.name },
    user: ctx.user.op,
  });
  if (!res) ctx.throw(403);
  ctx.meta._function = res;
}


/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function jsonp(ctx, next) {
    // options
    options = options || {};
    // whiteList
    if (ctx.app.meta.isTest) {
      options.whiteList = false;
    } else {
      const _config = ctx.config.module(moduleInfo.relativeName);
      const _whiteList = _config && _config.jsonp && _config.jsonp.whiteList;
      const hostSelf = ctx.hostname;
      if (_whiteList) {
        if (!Array.isArray(_whiteList)) {
          options.whiteList = _whiteList.split(',');
        } else {
          options.whiteList = _whiteList.concat();
        }
        options.whiteList.push(hostSelf);
      } else {
        options.whiteList = [ hostSelf ];
      }
    }
    // jsonp
    const fn = ctx.app.jsonp(options);
    await fn(ctx, next);
  };
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function httpLog(ctx, next) {
    await next();

    // check if log
    const _config = ctx.config.module(moduleInfo.relativeName);
    if (!_config.httpLog) return;

    //
    const req = ctx.request;
    const res = ctx.response;

    // check if json
    if (res.type.indexOf('application/json') === -1) return;

    // log
    let log = '\n';
    // query
    if (req.query && Object.keys(req.query).length > 0) {
      log = `${log}query:
  ${JSON.stringify(req.query)}
`;
    }
    // params
    if (req.params && Object.keys(req.params).length > 0) {
      log = `${log}params:
  ${JSON.stringify(req.params)}
`;
    }
    // body
    if (req.body && Object.keys(req.body).length > 0) {
      log = `${log}body:
  ${JSON.stringify(req.body)}
`;
    }
    // res
    log = `${log}response:
  ${JSON.stringify(res.body)}
`;
    // log
    ctx.logger.info(log);
  };
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(49);
const base = __webpack_require__(50);
const user = __webpack_require__(51);
const atom = __webpack_require__(52);
const atomClass = __webpack_require__(53);
const atomAction = __webpack_require__(54);
const func = __webpack_require__(55);
const schedule = __webpack_require__(56);
const startup = __webpack_require__(57);
const auth = __webpack_require__(58);
const comment = __webpack_require__(59);
const layoutConfig = __webpack_require__(60);

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/update8FunctionScenes', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/update8Atoms', controller: version, middlewares: 'inner' },
    // base
    { method: 'post', path: 'base/modules', controller: base },
    { method: 'post', path: 'base/locales', controller: base },
    { method: 'post', path: 'base/atomClasses', controller: base },
    { method: 'post', path: 'base/actions', controller: base },
    { method: 'post', path: 'base/flags', controller: base },
    { method: 'post', path: 'base/orders', controller: base },
    { method: 'post', path: 'base/menus', controller: base },
    { method: 'post', path: 'base/panels', controller: base },
    { method: 'post', path: 'base/widgets', controller: base },
    { method: 'post', path: 'base/sections', controller: base },
    { method: 'post', path: 'base/buttons', controller: base },
    { method: 'post', path: 'base/functions', controller: base },
    { method: 'get', path: 'base/performAction', controller: base, middlewares: 'jsonp', meta: { auth: { enable: false } } },
    { method: 'get', path: 'base/qrcode', controller: base, meta: { auth: { enable: false } } },
    { method: 'post', path: 'base/themes', controller: base },
    // atom
    { method: 'post', path: 'atom/preferredRoles', controller: atom },
    { method: 'post', path: 'atom/create', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 1 } },
    },
    { method: 'post', path: 'atom/read', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/select', controller: atom },
    { method: 'post', path: 'atom/count', controller: atom },
    { method: 'post', path: 'atom/write', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 3 } },
    },
    { method: 'post', path: 'atom/submit', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 3 } },
    },
    { method: 'post', path: 'atom/delete', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom', action: 4 } },
    },
    { method: 'post', path: 'atom/action', controller: atom, middlewares: 'transaction',
      meta: { right: { type: 'atom' } },
    },
    { method: 'post', path: 'atom/enable', controller: atom, middlewares: 'transaction' },
    { method: 'post', path: 'atom/star', controller: atom,
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'atom/readCount', controller: atom,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'atom/stats', controller: atom },
    { method: 'post', path: 'atom/labels', controller: atom,
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'atom/actions', controller: atom },
    { method: 'post', path: 'atom/schema', controller: atom },
    { method: 'post', path: 'atom/validator', controller: atom },
    // comment
    { method: 'post', path: 'comment/all', controller: comment },
    { method: 'post', path: 'comment/list', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/item', controller: comment,
      meta: { right: { type: 'atom', action: 2 } },
    },
    { method: 'post', path: 'comment/save', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'comment/delete', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    { method: 'post', path: 'comment/heart', controller: comment, middlewares: 'transaction',
      meta: {
        auth: { user: true },
        right: { type: 'atom', action: 2 },
      },
    },
    // user
    { method: 'post', path: 'user/getLabels', controller: user },
    { method: 'post', path: 'user/setLabels', controller: user },
    // function
    { method: 'post', path: 'function/scenes', controller: func },
    { method: 'post', path: 'function/list', controller: func },
    { method: 'post', path: 'function/star', controller: func },
    { method: 'post', path: 'function/check', controller: func },
    { method: 'post', path: 'function/register', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'function/setLocalesQueue', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'function/setLocalesStartup', controller: func, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // atomAction
    { method: 'post', path: 'atomAction/register', controller: atomAction, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // atomClass
    { method: 'post', path: 'atomClass/register', controller: atomClass, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'atomClass/validatorSearch', controller: atomClass },
    { method: 'post', path: 'atomClass/checkRightCreate', controller: atomClass },
    { method: 'post', path: 'atomClass/atomClass', controller: atomClass },
    // schedule
    { method: 'post', path: 'schedule/installAllSchedules', controller: schedule, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    { method: 'post', path: 'schedule/scheduleQueue', controller: schedule, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    // startup
    { method: 'post', path: 'startup/startupQueue', controller: startup, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    // auth
    { method: 'post', path: 'auth/echo', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/check', controller: auth, meta: { auth: { user: true } } },
    { method: 'post', path: 'auth/logout', controller: auth, meta: { auth: { enable: false } } },
    { method: 'post', path: 'auth/installAuthProviders', controller: auth, middlewares: 'inner',
      meta: { instance: { enable: false } },
    },
    { method: 'post', path: 'auth/register', controller: auth, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    { method: 'post', path: 'auth/providerChanged', controller: auth, middlewares: 'inner',
      meta: { auth: { enable: false } },
    },
    // cors
    { method: 'options', path: /.*/ },
    // layoutConfig
    { method: 'post', path: 'layoutConfig/load', controller: layoutConfig },
    { method: 'post', path: 'layoutConfig/save', controller: layoutConfig },
    { method: 'post', path: 'layoutConfig/saveKey', controller: layoutConfig },
  ];
  return routes;
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = app => {
  class VersionController extends app.Controller {

    async update() {
      await this.service.version.update(this.ctx.request.body);
      this.ctx.success();
    }

    async init() {
      await this.service.version.init(this.ctx.request.body);
      this.ctx.success();
    }

    async update8FunctionScenes() {
      await this.service.version.update8FunctionScenes(this.ctx.request.body);
      this.ctx.success();
    }

    async update8Atoms() {
      await this.service.version.update8Atoms(this.ctx.request.body);
      this.ctx.success();
    }

  }
  return VersionController;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const qr = require3('qr-image');

module.exports = app => {

  class BaseController extends app.Controller {

    modules() {
      const res = this.ctx.service.base.modules();
      this.ctx.success(res);
    }

    locales() {
      const res = this.ctx.service.base.locales();
      this.ctx.success(res);
    }

    atomClasses() {
      const res = this.ctx.service.base.atomClasses();
      this.ctx.success(res);
    }

    actions() {
      const res = this.ctx.service.base.actions();
      this.ctx.success(res);
    }

    flags() {
      const res = this.ctx.service.base.flags();
      this.ctx.success(res);
    }

    orders() {
      const res = this.ctx.service.base.orders();
      this.ctx.success(res);
    }

    menus() {
      const res = this.ctx.service.base.menus();
      this.ctx.success(res);
    }

    panels() {
      const res = this.ctx.service.base.panels();
      this.ctx.success(res);
    }

    widgets() {
      const res = this.ctx.service.base.widgets();
      this.ctx.success(res);
    }

    sections() {
      const res = this.ctx.service.base.sections();
      this.ctx.success(res);
    }

    buttons() {
      const res = this.ctx.service.base.buttons();
      this.ctx.success(res);
    }

    functions() {
      const res = this.ctx.service.base.functions();
      this.ctx.success(res);
    }

    themes() {
      const res = this.ctx.service.base.themes();
      this.ctx.success(res);
    }

    async performAction() {
      // params
      const params = JSON.parse(this.ctx.request.query.params);
      // performAction
      const res = await this.ctx.performAction(params);
      this.ctx.success(res);
    }

    async qrcode() {
      const query = this.ctx.request.query;
      const img = qr.image(query.text || '', {
        type: query.type || 'png',
        size: query.size || 10,
        margin: query.margin || 4,
        ec_level: query.ec_level || 'M',
      });
      // ok
      this.ctx.status = 200;
      this.ctx.type = 'image/png';
      this.ctx.body = img;
    }

  }

  return BaseController;
};


/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports = app => {

  class UserController extends app.Controller {

    async getLabels() {
      const res = await this.ctx.service.user.getLabels({
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async setLabels() {
      await this.ctx.service.user.setLabels({
        labels: this.ctx.request.body.labels,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

  }
  return UserController;
};



/***/ }),
/* 52 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomController extends app.Controller {

    async preferredRoles() {
      const res = await this.ctx.service.atom.preferredRoles({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }
    async create() {
      const res = await this.ctx.service.atom.create({
        atomClass: this.ctx.request.body.atomClass,
        roleIdOwner: this.ctx.request.body.roleIdOwner,
        item: this.ctx.request.body.item,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async read() {
      const res = await this.ctx.service.atom.read({
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    // options
    //   where, orders, page, star, label
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.atom.select({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.atom.count({
        atomClass: this.ctx.request.body.atomClass,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.success(count);
    }

    async write() {
      await this.ctx.service.atom.write({
        key: this.ctx.request.body.key,
        item: this.ctx.request.body.item,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async submit() {
      await this.write();
      await this.enable();
      this.ctx.success();
    }

    async delete() {
      await this.ctx.service.atom.delete({
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success();
    }

    async action() {
      const res = await this.ctx.service.atom.action({
        action: this.ctx.request.body.action,
        key: this.ctx.request.body.key,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async enable() {
      // only allowed: draft
      const key = this.ctx.request.body.key;
      const user = this.ctx.user.op;
      const atom = await this.ctx.meta.atom._get({ atom: { id: key.atomId }, user });
      if (atom.atomEnabled || user.id !== atom.userIdCreated) this.ctx.throw(403);
      // enable
      const res = await this.ctx.service.atom.enable({
        key,
        atom: { atomEnabled: 1 },
        user,
      });
      this.ctx.success(res);
    }

    async star() {
      const res = await this.ctx.service.atom.star({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async readCount() {
      const res = await this.ctx.service.atom.readCount({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async stats() {
      // atomIds
      const atomIds = this.ctx.request.body.atomIds;
      const options = {
        where: {
          'a.id': { op: 'in', val: atomIds },
        },
      };
      // select
      const res = await this.ctx.meta.atom.select({
        options, user: this.ctx.user.op, pageForce: false,
      });
      this.ctx.success(res);
    }

    async labels() {
      const res = await this.ctx.service.atom.labels({
        key: this.ctx.request.body.key,
        atom: this.ctx.request.body.atom,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async actions() {
      const res = await this.ctx.service.atom.actions({
        key: this.ctx.request.body.key,
        basic: this.ctx.request.body.basic,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async schema() {
      const res = await this.ctx.service.atom.schema({
        atomClass: this.ctx.request.body.atomClass,
        schema: this.ctx.request.body.schema,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async validator() {
      const res = await this.ctx.service.atom.validator({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return AtomController;
};



/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClassController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomClass.register({
        module: this.ctx.request.body.module,
        atomClassName: this.ctx.request.body.atomClassName,
        atomClassIdParent: this.ctx.request.body.atomClassIdParent,
      });
      this.ctx.success(res);
    }

    async validatorSearch() {
      const res = await this.ctx.service.atomClass.validatorSearch({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

    async checkRightCreate() {
      const res = await this.ctx.service.atomClass.checkRightCreate({
        atomClass: this.ctx.request.body.atomClass,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async atomClass() {
      const res = await this.ctx.service.atomClass.atomClass({
        atomClass: this.ctx.request.body.atomClass,
      });
      this.ctx.success(res);
    }

  }

  return AtomClassController;
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomActionController extends app.Controller {

    async register() {
      const res = await this.ctx.service.atomAction.register({
        atomClassId: this.ctx.request.body.atomClassId,
        code: this.ctx.request.body.code,
      });
      this.ctx.success(res);
    }

  }

  return AtomActionController;
};


/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = app => {

  class FunctionController extends app.Controller {

    // options
    //   where, orders, page, star,language
    async list() {
      const options = this.ctx.request.body.options || {};
      options.page = this.ctx.meta.util.page(options.page, false); // false
      // locale maybe '' for selectAllFunctions
      if (options.locale === undefined) options.locale = this.ctx.locale;
      const items = await this.ctx.service.function.list({
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async star() {
      const res = await this.ctx.service.function.star({
        id: this.ctx.request.body.id,
        star: this.ctx.request.body.star,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async check() {
      const res = await this.ctx.service.function.check({
        functions: this.ctx.request.body.functions,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async register() {
      const res = await this.ctx.service.function.register({
        module: this.ctx.request.body.module,
        name: this.ctx.request.body.name,
      });
      this.ctx.success(res);
    }

    async setLocalesStartup() {
      const res = await this.ctx.service.function.setLocalesStartup();
      this.ctx.success(res);
    }

    async setLocalesQueue() {
      const res = await this.ctx.service.function.setLocalesQueue({
        options: this.ctx.request.body.options,
      });
      this.ctx.success(res);
    }

    async scenes() {
      const res = await this.ctx.service.function.scenes({
        sceneMenu: this.ctx.request.body.sceneMenu,
      });
      this.ctx.success(res);
    }

  }

  return FunctionController;
};


/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = app => {

  class ScheduleController extends app.Controller {

    async installAllSchedules() {
      await this.ctx.service.schedule.installAllSchedules();
      this.ctx.success();
    }

    async scheduleQueue() {
      await this.ctx.service.schedule.scheduleQueue({
        module: this.ctx.request.body.module,
        schedule: this.ctx.request.body.schedule,
      });
      this.ctx.success();
    }

  }

  return ScheduleController;
};


/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = app => {

  class StartupController extends app.Controller {

    async startupQueue() {
      await this.ctx.service.startup.startupQueue({
        key: this.ctx.request.body.key,
        startup: this.ctx.request.body.startup,
        info: this.ctx.request.body.info,
      });
      this.ctx.success();
    }

  }

  return StartupController;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = app => {

  class AuthController extends app.Controller {

    // return current user auth info
    //   { op:{id},agent:{id},provider}
    async echo() {
      const info = await this.ctx.meta.auth.echo();
      this.ctx.success(info);
    }

    async check() {
      const info = await this.ctx.meta.auth.check();
      this.ctx.success(info);
    }

    async logout() {
      const info = await this.ctx.meta.auth.logout();
      this.ctx.success(info);
    }

    async installAuthProviders() {
      // register all authProviders
      await this.ctx.service.auth.installAuthProviders();
      // verify
      this.app.passport.verify(async (ctx, profileUser) => {
        // state: login/associate
        const state = ctx.request.query.state || 'login';
        // user verify
        return await ctx.meta.user.verify({ state, profileUser });
      });
      // // serializeUser
      // app.passport.serializeUser(async (ctx, user) => {
      //   return {
      //     agent: { id: user.agent.id, iid: user.agent.iid },
      //     op: { id: user.op.id, iid: user.op.iid },
      //     provider: user.provider,
      //   };
      // });
      // // deserializeUser
      // app.passport.deserializeUser(async (ctx, user) => {
      //   return user;
      // });
      // ok
      this.ctx.success();
    }

    async register() {
      const res = await this.ctx.service.auth.register({
        module: this.ctx.request.body.module,
        providerName: this.ctx.request.body.providerName,
      });
      this.ctx.success(res);
    }

    async providerChanged() {
      const res = await this.ctx.service.auth.providerChanged({
        module: this.ctx.request.body.module,
        providerName: this.ctx.request.body.providerName,
      });
      this.ctx.success(res);
    }

  }

  return AuthController;
};


/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = app => {

  class CommentController extends app.Controller {

    async all() {
      const options = this.ctx.request.body.options;
      options.comment = 1;
      const res = await this.ctx.performAction({
        method: 'post',
        url: 'atom/select',
        body: {
          atomClass: this.ctx.request.body.atomClass,
          options,
        },
      });
      this.ctx.success(res);
    }

    async list() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.meta.util.page(options.page);
      const items = await this.ctx.service.comment.list({
        key: this.ctx.request.body.key,
        options,
        user: this.ctx.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async item() {
      const res = await this.ctx.service.comment.item({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.ctx.service.comment.save({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async delete() {
      const res = await this.ctx.service.comment.delete({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async heart() {
      const res = await this.ctx.service.comment.heart({
        key: this.ctx.request.body.key,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return CommentController;
};


/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = app => {
  class LayoutConfigController extends app.Controller {

    async load() {
      const res = await this.service.layoutConfig.load({
        module: this.ctx.request.body.module,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async save() {
      const res = await this.service.layoutConfig.save({
        module: this.ctx.request.body.module,
        data: this.ctx.request.body.data,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

    async saveKey() {
      const res = await this.service.layoutConfig.saveKey({
        module: this.ctx.request.body.module,
        key: this.ctx.request.body.key,
        value: this.ctx.request.body.value,
        user: this.ctx.user.op,
      });
      this.ctx.success(res);
    }

  }
  return LayoutConfigController;
};


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

const version = __webpack_require__(62);
const base = __webpack_require__(76);
const user = __webpack_require__(77);
const atom = __webpack_require__(78);
const atomClass = __webpack_require__(79);
const atomAction = __webpack_require__(80);
const schedule = __webpack_require__(81);
const startup = __webpack_require__(82);
const auth = __webpack_require__(83);
const func = __webpack_require__(84);
const comment = __webpack_require__(85);
const layoutConfig = __webpack_require__(86);

module.exports = app => {
  const services = {
    version,
    base,
    user,
    atom,
    atomClass,
    atomAction,
    schedule,
    startup,
    auth,
    function: func,
    comment,
    layoutConfig,
  };
  return services;
};


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

const VersionUpdate1Fn = __webpack_require__(63);
const VersionUpdate2Fn = __webpack_require__(65);
const VersionUpdate3Fn = __webpack_require__(66);
const VersionUpdate4Fn = __webpack_require__(67);
const VersionUpdate6Fn = __webpack_require__(68);
const VersionUpdate8Fn = __webpack_require__(69);
const VersionInit2Fn = __webpack_require__(70);
const VersionInit4Fn = __webpack_require__(72);
const VersionInit5Fn = __webpack_require__(73);
const VersionInit7Fn = __webpack_require__(74);
const VersionInit8Fn = __webpack_require__(75);

module.exports = app => {

  class Version extends app.Service {

    async update(options) {

      if (options.version === 8) {
        const versionUpdate8 = new (VersionUpdate8Fn(this.ctx))();
        await versionUpdate8.run();
      }

      if (options.version === 6) {
        const versionUpdate6 = new (VersionUpdate6Fn(this.ctx))();
        await versionUpdate6.run();
      }

      if (options.version === 4) {
        const versionUpdate4 = new (VersionUpdate4Fn(this.ctx))();
        await versionUpdate4.run();
      }

      if (options.version === 3) {
        const versionUpdate3 = new (VersionUpdate3Fn(this.ctx))();
        await versionUpdate3.run();
      }

      if (options.version === 2) {
        const versionUpdate2 = new (VersionUpdate2Fn(this.ctx))();
        await versionUpdate2.run();
      }

      if (options.version === 1) {
        const versionUpdate1 = new (VersionUpdate1Fn(this.ctx))();
        await versionUpdate1.run();
      }
    }

    async init(options) {

      if (options.version === 2) {
        const versionInit2 = new (VersionInit2Fn(this.ctx))();
        await versionInit2.run(options);
      }
      if (options.version === 4) {
        const versionInit4 = new (VersionInit4Fn(this.ctx))();
        await versionInit4.run(options);
      }
      if (options.version === 5) {
        const versionInit5 = new (VersionInit5Fn(this.ctx))();
        await versionInit5.run(options);
      }
      if (options.version === 7) {
        const versionInit7 = new (VersionInit7Fn(this.ctx))();
        await versionInit7.run(options);
      }
      if (options.version === 8) {
        const versionInit8 = new (VersionInit8Fn(this.ctx))();
        await versionInit8.run(options);
      }
    }

    async update8FunctionScenes(options) {
      const versionUpdate8 = new (VersionUpdate8Fn(this.ctx))();
      await versionUpdate8._updateFunctionsInstance(options);
    }

    async update8Atoms(options) {
      const versionUpdate8 = new (VersionUpdate8Fn(this.ctx))();
      await versionUpdate8._updateAtomsInstance(options);
    }

  }

  return Version;
};


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

const update1Data = __webpack_require__(64);

module.exports = function(ctx) {

  class VersionUpdate1 {

    async run() {
      // tables
      const tableNames = [
        'aUser', 'aUserAgent', 'aAuthProvider', 'aAuth', 'aRole', 'aRoleInc', 'aUserRole', 'aRoleRight',
        'aAtomClass', 'aAtom', 'aAtomAction',
        'aLabel', 'aAtomLabel', 'aAtomLabelRef', 'aAtomStar',
        'aRoleRef', 'aRoleIncRef', 'aRoleExpand', 'aRoleRightRef',
        'aFunction', 'aFunctionStar', 'aFunctionLocale', 'aRoleFunction',
      ];

      for (const tableName of tableNames) {
        await ctx.model.query(update1Data.tables[tableName]);
      }

      // views
      const viewNames = [
        'aViewUserRoleRef',
        'aViewUserRoleExpand',
        'aViewUserRightAtomClass',
        'aViewUserRightAtomClassUser',
        'aViewUserRightAtom',
        'aViewUserRightFunction',
      ];
      for (const viewName of viewNames) {
        await ctx.model.query(update1Data.views[viewName]);
      }

      // functions
      const functionNames = [
      ];
      for (const functionName of functionNames) {
        await ctx.model.query(update1Data.functions[functionName]);
      }

    }

  }

  return VersionUpdate1;
};


/***/ }),
/* 64 */
/***/ (function(module, exports) {

const tables = {
  aUser: `
          CREATE TABLE aUser (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            userName varchar(50) DEFAULT NULL,
            realName varchar(50) DEFAULT NULL,
            email varchar(50) DEFAULT NULL,
            mobile varchar(50) DEFAULT NULL,
            avatar varchar(255) DEFAULT NULL,
            motto varchar(255) DEFAULT NULL,
            locale varchar(255) DEFAULT NULL,
            anonymous int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserAgent: `
          CREATE TABLE aUserAgent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            userIdAgent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAuthProvider: `
          CREATE TABLE aAuthProvider (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            disabled int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            providerName varchar(50) DEFAULT NULL,
            config json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAuth: `
          CREATE TABLE aAuth (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            providerId int(11) DEFAULT '0',
            profileId varchar(255) DEFAULT NULL,
            profile json DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRole: `
          CREATE TABLE aRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleName varchar(50) DEFAULT NULL,
            leader int(11) DEFAULT '0',
            catalog int(11) DEFAULT '0',
            \`system\` int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleRef: `
          CREATE TABLE aRoleRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdParent int(11) DEFAULT '0',
            level int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleInc: `
          CREATE TABLE aRoleInc (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleIncRef: `
          CREATE TABLE aRoleIncRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdInc int(11) DEFAULT '0',
            roleIdSrc int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aRoleExpand: `
          CREATE TABLE aRoleExpand (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            roleIdBase int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aUserRole: `
          CREATE TABLE aUserRole (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomClass: `
          CREATE TABLE aAtomClass (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            atomClassName varchar(255) DEFAULT NULL,
            atomClassIdParent int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            flow int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtom: `
          CREATE TABLE aAtom (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            atomEnabled int(11) DEFAULT '0',
            atomFlow int(11) DEFAULT '0',
            atomFlag int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            atomName varchar(255) DEFAULT NULL,
            userIdCreated int(11) DEFAULT '0',
            userIdUpdated int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomAction: `
          CREATE TABLE aAtomAction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            code int(11) DEFAULT '0',
            name varchar(50) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aLabel: `
          CREATE TABLE aLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabel: `
          CREATE TABLE aAtomLabel (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labels JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aAtomLabelRef: `
          CREATE TABLE aAtomLabelRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            labelId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aAtomStar: `
          CREATE TABLE aAtomStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aRoleRight: `
          CREATE TABLE aRoleRight (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            scope JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleRightRef: `
          CREATE TABLE aRoleRightRef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            roleIdScope int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunction: `
          CREATE TABLE aFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            module varchar(255) DEFAULT NULL,
            name varchar(255) DEFAULT NULL,
            title varchar(255) DEFAULT NULL,
            scene int(11) DEFAULT '0',
            autoRight int(11) DEFAULT '0',
            atomClassId int(11) DEFAULT '0',
            action int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            menu int(11) DEFAULT '0',
            public int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
  aFunctionStar: `
          CREATE TABLE aFunctionStar (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            star int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `,
  aFunctionLocale: `
          CREATE TABLE aFunctionLocale (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            locale varchar(50) DEFAULT NULL,
            titleLocale varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `,
  aRoleFunction: `
          CREATE TABLE aRoleFunction (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            roleId int(11) DEFAULT '0',
            functionId int(11) DEFAULT '0',
            roleRightId int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `,
};

const views = {
  aViewUserRoleRef: `
create view aViewUserRoleRef as
  select a.iid,a.userId,a.roleId,b.roleIdParent,b.level from aUserRole a
    inner join aRoleRef b on a.roleId=b.roleId
  `,
  aViewUserRoleExpand: `
create view aViewUserRoleExpand as
  select a.iid,a.userId,a.roleId,b.roleIdBase,b.id as roleExpandId from aUserRole a
    left join aRoleExpand b on a.roleId=b.roleId
  `,
  aViewUserRightAtomClass: `
create view aViewUserRightAtomClass as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope from aViewUserRoleExpand a
    inner join aRoleRight b on a.roleIdBase=b.roleId
  `,
  aViewUserRightAtomClassUser: `
create view aViewUserRightAtomClassUser as
  select a.iid,a.userId as userIdWho,b.atomClassId,b.action,c.userId as userIdWhom from aViewUserRoleExpand a
    inner join aRoleRightRef b on a.roleIdBase=b.roleId
    inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
  `,
  aViewUserRightAtom: `
create view aViewUserRightAtom as
  select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassUser b
    where a.deleted=0 and a.atomEnabled=1
      and a.atomClassId=b.atomClassId
      and a.userIdCreated=b.userIdWhom
  `,
  aViewUserRightFunction: `
create view aViewUserRightFunction as
  select a.iid,a.userId as userIdWho,a.roleExpandId,a.roleId,a.roleIdBase,b.id as roleFunctionId,b.functionId from aViewUserRoleExpand a
    inner join aRoleFunction b on a.roleIdBase=b.roleId
  `,
};

const functions = {
};

module.exports = {
  tables,
  views,
  functions,
};


/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionUpdate2 {

    async run() {
      // enable 0
      await ctx.model.query('SET SESSION sql_mode=\'NO_AUTO_VALUE_ON_ZERO\'');
      // add userId 0
      await ctx.db.insert('aUser', {
        id: 0,
        iid: 0,
        userName: 'system',
        realName: 'system',
      });
      // add roleId 0
      await ctx.db.insert('aRole', {
        id: 0,
        iid: 0,
        roleName: 'system',
        catalog: 1,
        system: 1,
        roleIdParent: -1,
      });
      // disable 0
      await ctx.model.query('SET SESSION sql_mode=\'\'');
    }

  }

  return VersionUpdate2;
};


/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionUpdate3 {

    async run() {
      // aViewRoleRightAtomClassUser
      let sql = `
        create view aViewRoleRightAtomClassUser as
          select a.iid,a.roleId as roleIdWho,b.atomClassId,b.action,c.userId as userIdWhom from aRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aViewUserRoleRef c on b.roleIdScope=c.roleIdParent
          `;
      await ctx.model.query(sql);

      // aViewRoleRightAtom
      sql = `
        create view aViewRoleRightAtom as
          select a.iid, a.id as atomId,a.userIdCreated as userIdWhom,b.roleIdWho,b.action from aAtom a,aViewRoleRightAtomClassUser b
            where a.deleted=0 and a.atomEnabled=1
              and a.atomClassId=b.atomClassId
              and a.userIdCreated=b.userIdWhom
          `;
      await ctx.model.query(sql);

      // aCheckRoleRightRead
      sql = `
        create procedure aCheckRoleRightRead (in _iid int,in _roleIdWho int,in _atomId int)
        begin

          select a.* from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
            where (
             a.deleted=0 and a.iid=_iid and a.id=_atomId
             and (
                    (a.atomEnabled=1 and (
                      (
                        a.atomFlow=1 and (
                          (exists(select c.atomId from aViewRoleRightAtom c where c.iid=_iid and a.id=c.atomId and c.action>2 and c.roleIdWho=_roleIdWho))
                        )
                      ) or (
                        a.atomFlow=0 and (
                          b.public=1 or exists(select c.atomId from aViewRoleRightAtom c where c.iid=_iid and a.id=c.atomId and c.action=2 and c.roleIdWho=_roleIdWho)
                        )
                      )
                    ))
                  )
            );

        end
        `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate3;
};


/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionUpdate4 {

    async run() {

      // aComment
      let sql = `
          CREATE TABLE aComment (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            sorting int(11) DEFAULT '0',
            heartCount int(11) DEFAULT '0',
            replyId int(11) DEFAULT '0',
            replyUserId int(11) DEFAULT '0',
            replyContent text DEFAULT NULL,
            content text DEFAULT NULL,
            summary text DEFAULT NULL,
            html text DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aViewComment
      sql = `
          create view aViewComment as
            select a.*,b.userName,b.avatar,c.userName as replyUserName from aComment a
              left join aUser b on a.userId=b.id
              left join aUser c on a.replyUserId=c.id
        `;
      await ctx.model.query(sql);

      // aCommentHeart
      sql = `
          CREATE TABLE aCommentHeart (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            userId int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            commentId int(11) DEFAULT '0',
            heart int(11) DEFAULT '1',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aAtom
      sql = `
        ALTER TABLE aAtom
          MODIFY COLUMN updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          ADD COLUMN allowComment int(11) DEFAULT '1',
          ADD COLUMN starCount int(11) DEFAULT '0',
          ADD COLUMN commentCount int(11) DEFAULT '0',
          ADD COLUMN attachmentCount int(11) DEFAULT '0',
          ADD COLUMN readCount int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate4;
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionUpdate6 {

    async run() {

      // aUser
      const sql = `
        ALTER TABLE aUser
          ADD COLUMN activated int(11) DEFAULT '0',
          ADD COLUMN emailConfirmed int(11) DEFAULT '0',
          ADD COLUMN mobileVerified int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

    }

  }

  return VersionUpdate6;
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

const constants = __webpack_require__(1);

module.exports = function(ctx) {

  class VersionUpdate8 {

    async run(options) {

      let sql;

      // aFunctionScene
      sql = `
          CREATE TABLE aFunctionScene (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            sceneName varchar(50) DEFAULT NULL,
            sceneMenu int(11) DEFAULT '0',
            sceneSorting int(11) DEFAULT '0',
            PRIMARY KEY (id)
          )
        `;
      await ctx.model.query(sql);

      // aFunction: scene -> sceneId
      sql = `
        ALTER TABLE aFunction
          CHANGE COLUMN scene sceneId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // update exists functions
      await this._updateFunctions(options);


      // aAtom: add field roleIdOwner
      sql = `
        ALTER TABLE aAtom
          ADD COLUMN roleIdOwner int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // aViewRoleRightAtomClass
      sql = `
        create view aViewRoleRightAtomClass as
          select a.iid,a.roleId as roleIdWho,a.roleIdBase,b.id as roleRightId,b.atomClassId,b.action,b.scope from aRoleExpand a
            inner join aRoleRight b on a.roleIdBase=b.roleId
          `;
      await ctx.model.query(sql);

      // aViewUserRightAtomClassRole
      sql = `
        create view aViewUserRightAtomClassRole as
          select a.iid,a.userId as userIdWho,b.atomClassId,b.action,c.roleId as roleIdWhom from aViewUserRoleExpand a
            inner join aRoleRightRef b on a.roleIdBase=b.roleId
            inner join aRoleRef c on b.roleIdScope=c.roleIdParent
          `;
      await ctx.model.query(sql);

      // aViewUserRightAtomRole
      sql = `
        create view aViewUserRightAtomRole as
          select a.iid, a.id as atomId,a.roleIdOwner as roleIdWhom,b.userIdWho,b.action from aAtom a,aViewUserRightAtomClassRole b
            where a.deleted=0 and a.atomEnabled=1
              and a.atomClassId=b.atomClassId
              and a.roleIdOwner=b.roleIdWhom
        `;
      await ctx.model.query(sql);

      // update exists atoms
      await this._updateAtoms(options);
    }

    async _updateFunctions(options) {
      // all instances
      const instances = await ctx.model.query('select * from aInstance');
      for (const instance of instances) {
        await ctx.performAction({
          subdomain: instance.name,
          method: 'post',
          url: 'version/update8FunctionScenes',
          body: options,
        });
      }
    }

    async _updateFunctionsInstance() {
      // update sceneName
      const scenes = constants.function.scene;
      for (const sceneName in scenes) {
        const sceneValue = scenes[sceneName];
        const sceneId = await ctx.meta.function.getSceneId({ sceneName, sceneMenu: 1 });
        await ctx.model.query('update aFunction set sceneId=? where iid=? and sceneId=?',
          [ sceneId, ctx.instance.id, sceneValue ]);
      }
    }

    async _updateAtoms(options) {
      // all instances
      const instances = await ctx.model.query('select * from aInstance');
      for (const instance of instances) {
        await ctx.performAction({
          subdomain: instance.name,
          method: 'post',
          url: 'version/update8Atoms',
          body: options,
        });
      }
    }

    async _updateAtomsInstance() {
      // cache
      const mapUserAtomClassRole = {};
      // atoms
      const atoms = await ctx.model.query('select id, atomClassId, userIdCreated from aAtom where iid=? and deleted=0',
        [ ctx.instance.id ]);
      for (const atom of atoms) {
        const mapKey = `${atom.userIdCreated}:${atom.atomClassId}`;
        let mapValue = mapUserAtomClassRole[mapKey];
        if (mapValue === undefined) {
          mapValue = mapUserAtomClassRole[mapKey] = await this._getRoleIdOwner(atom.atomClassId, atom.userIdCreated);
        }
        if (mapValue > 0) {
          await ctx.model.query('update aAtom set roleIdOwner=? where id=?', [ mapValue, atom.id ]);
        }
      }
    }

    async _getRoleIdOwner(atomClassId, userId) {
      const roles = await ctx.meta.atom.preferredRoles({
        atomClass: { id: atomClassId },
        user: { id: userId },
      });
      if (roles.length === 0) return 0;
      return roles[0].roleIdWho;
    }


  }

  return VersionUpdate8;
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');
const initData = __webpack_require__(71);

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roles
      const roleIds = await this._initRoles();
      // role includes
      await this._roleIncludes(roleIds);
      // build
      await ctx.meta.role.setDirty(true);
      // users
      await this._initUsers(roleIds, options);
    }

    // roles
    async _initRoles() {
      const roleIds = {};
      roleIds.system = 0;
      // system roles
      for (const roleName of ctx.constant.systemRoles) {
        const role = extend(true, {}, initData.roles[roleName]);
        role.roleIdParent = roleIds[role.roleIdParent];
        roleIds[roleName] = await ctx.meta.role.add(role);
      }
      return roleIds;
    }

    // role includes
    async _roleIncludes(roleIds) {
      for (const item of initData.includes) {
        await ctx.meta.role.addRoleInc({ roleId: roleIds[item.from], roleIdInc: roleIds[item.to] });
      }
    }

    // users
    async _initUsers(roleIds, options) {
      // root user
      const userRoot = extend(true, {}, initData.users.root);
      userRoot.item.email = options.email;
      userRoot.item.mobile = options.mobile;
      const userId = await ctx.meta.user.add(userRoot.item);
      // activated
      await ctx.meta.user.save({
        user: { id: userId, activated: 1 },
      });
      // user->role
      await ctx.meta.role.addUserRole({
        userId,
        roleId: roleIds[userRoot.roleId],
      });
    }

  }

  return VersionInit;
};


/***/ }),
/* 71 */
/***/ (function(module, exports) {

// roles
const roles = {
  root: {
    roleName: 'root', leader: 0, catalog: 1, system: 1, sorting: 0, roleIdParent: 'system',
  },
  anonymous: {
    roleName: 'anonymous', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'root',
  },
  authenticated: {
    roleName: 'authenticated', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'root',
  },
  template: {
    roleName: 'template', leader: 0, catalog: 1, system: 1, sorting: 1, roleIdParent: 'authenticated',
  },
  system: {
    roleName: 'system', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'template',
  },
  registered: {
    roleName: 'registered', leader: 0, catalog: 0, system: 1, sorting: 2, roleIdParent: 'authenticated',
  },
  activated: {
    roleName: 'activated', leader: 0, catalog: 0, system: 1, sorting: 3, roleIdParent: 'authenticated',
  },
  superuser: {
    roleName: 'superuser', leader: 0, catalog: 0, system: 1, sorting: 4, roleIdParent: 'authenticated',
  },
  organization: {
    roleName: 'organization', leader: 0, catalog: 1, system: 1, sorting: 5, roleIdParent: 'authenticated',
  },
  internal: {
    roleName: 'internal', leader: 0, catalog: 1, system: 1, sorting: 1, roleIdParent: 'organization',
  },
  external: {
    roleName: 'external', leader: 0, catalog: 1, system: 1, sorting: 2, roleIdParent: 'organization',
  },
};

const includes = [
  { from: 'superuser', to: 'system' },
];

const users = {
  root: {
    item: {
      userName: 'root',
      realName: 'root',
      email: null,
      mobile: null,
      avatar: null,
      motto: null,
      locale: null,
    },
    roleId: 'superuser',
  },
};

module.exports = {
  roles,
  includes,
  users,
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions
      const roleFunctions = [
        { roleName: 'root', name: 'listComment' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // add role:template to authenticated
      // add role:system to template
      const items = [
        {
          roleName: 'template', leader: 0, catalog: 1, system: 1, sorting: 0, roleIdParent: 'authenticated',
        },
        {
          roleName: 'system', leader: 0, catalog: 0, system: 1, sorting: 1, roleIdParent: 'template',
        },
      ];
      let needBuild = false;
      for (const item of items) {
        const role = await ctx.meta.role.getSystemRole({ roleName: item.roleName });
        if (!role) {
          needBuild = true;
          const roleParent = await ctx.meta.role.getSystemRole({ roleName: item.roleIdParent });
          const roleId = await ctx.meta.role.add({
            roleName: item.roleName,
            leader: item.leader,
            catalog: item.catalog,
            system: item.system,
            sorting: item.sorting,
            roleIdParent: roleParent.id,
          });
          if (item.roleName === 'system') {
            // superuser include system
            const roleSuperuser = await ctx.meta.role.getSystemRole({ roleName: 'superuser' });
            await ctx.meta.role.addRoleInc({ roleId: roleSuperuser.id, roleIdInc: roleId });
          }
        }
      }
      // build
      if (needBuild) {
        await ctx.meta.role.setDirty(true);
      }

    }

  }

  return VersionInit;
};


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionInit {

    async run(options) {
      // roleFunctions
      const roleFunctions = [
        { roleName: 'system', name: 'deleteComment' },
      ];
      await ctx.meta.role.addRoleFunctionBatch({ roleFunctions });
    }

  }

  return VersionInit;
};


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = function(ctx) {

  class VersionInit {

    async run() {
    }

  }

  return VersionInit;
};


/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports = app => {

  class Base extends app.Service {

    modules() {
      return this.ctx.meta.base.modules();
    }

    locales() {
      return this.ctx.meta.base.locales();
    }

    atomClasses() {
      return this.ctx.meta.base.atomClasses();
    }

    actions() {
      return this.ctx.meta.base.actions();
    }

    flags() {
      return this.ctx.meta.base.flags();
    }

    orders() {
      return this.ctx.meta.base.orders();
    }

    menus() {
      return this.ctx.meta.base.menus();
    }

    panels() {
      return this.ctx.meta.base.panels();
    }

    widgets() {
      return this.ctx.meta.base.widgets();
    }

    sections() {
      return this.ctx.meta.base.sections();
    }

    buttons() {
      return this.ctx.meta.base.buttons();
    }

    functions() {
      return this.ctx.meta.base.functions();
    }

    themes() {
      return this.ctx.meta.base.themes();
    }

  }

  return Base;
};


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = app => {

  class User extends app.Service {

    async getLabels({ user }) {
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      return res ? JSON.parse(res.labels) : null;
    }

    async setLabels({ labels, user }) {
      const labels2 = JSON.stringify(labels);
      const res = await this.ctx.model.label.get({
        userId: user.id,
      });
      if (!res) {
        await this.ctx.model.label.insert({
          userId: user.id,
          labels: labels2,
        });
      } else {
        await this.ctx.model.label.update({
          id: res.id,
          labels: labels2,
        });
      }
    }

  }

  return User;
};


/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = app => {

  class Atom extends app.Service {

    async preferredRoles({ atomClass, user }) {
      return await this.ctx.meta.atom.preferredRoles({ atomClass, user });
    }

    async create({ atomClass, roleIdOwner, item, user }) {
      return await this.ctx.meta.atom.create({ atomClass, roleIdOwner, item, user });
    }

    async read({ key, user }) {
      return await this.ctx.meta.atom.read({ key, user });
    }

    async select({ atomClass, options, user }) {
      return await this.ctx.meta.atom.select({ atomClass, options, user });
    }

    async count({ atomClass, options, user }) {
      return await this.ctx.meta.atom.count({ atomClass, options, user });
    }

    async write({ key, item, user }) {
      return await this.ctx.meta.atom.write({ key, item, user });
    }

    async delete({ key, user }) {
      return await this.ctx.meta.atom.delete({ key, user });
    }

    async action({ action, key, user }) {
      return await this.ctx.meta.atom.action({ action, key, user });
    }

    async enable({ key, atom, user }) {
      return await this.ctx.meta.atom.enable({ key, atom, user });
    }

    async star({ key, atom, user }) {
      return await this.ctx.meta.atom.star({ key, atom, user });
    }

    async readCount({ key, atom, user }) {
      return await this.ctx.meta.atom.readCount({ key, atom, user });
    }

    async labels({ key, atom, user }) {
      return await this.ctx.meta.atom.labels({ key, atom, user });
    }

    async actions({ key, basic, user }) {
      return await this.ctx.meta.atom.actions({ key, basic, user });
    }

    async schema({ atomClass, schema, user }) {
      return await this.ctx.meta.atom.schema({ atomClass, schema, user });
    }

    async validator({ atomClass, user }) {
      return await this.ctx.meta.atom.validator({ atomClass, user });
    }

  }

  return Atom;
};


/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomClass extends app.Service {

    async register({ module, atomClassName, atomClassIdParent }) {
      return await this.ctx.meta.atomClass.register({ module, atomClassName, atomClassIdParent });
    }

    async validatorSearch({ atomClass }) {
      return await this.ctx.meta.atomClass.validatorSearch({ atomClass });
    }

    async checkRightCreate({ atomClass, user }) {
      return await this.ctx.meta.atom.checkRightCreate({ atomClass, user });
    }

    async atomClass({ atomClass }) {
      return await this.ctx.meta.atomClass.get(atomClass);
    }

  }

  return AtomClass;
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = app => {

  class AtomAction extends app.Service {

    async register({ atomClassId, code }) {
      return await this.ctx.meta.atomAction.register({ atomClassId, code });
    }

  }

  return AtomAction;
};


/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Schedule extends app.Service {

    async installAllSchedules() {
      this.__installSchedules();
    }

    async scheduleQueue({ module, schedule }) {
      // schedule config
      const config = app.meta.configs[module];
      const scheduleConfig = config.schedules[schedule];
      // url
      const url = this.ctx.meta.util.combinePagePath(module, scheduleConfig.path);
      // performAction
      if (!scheduleConfig.instance) {
        return await this.ctx.performAction({
          method: 'post',
          url,
        });
      }
      // all instances
      const instances = await this.ctx.db.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this.ctx.performAction({
          subdomain: instance.name,
          method: 'post',
          url,
        });
      }
    }

    __installSchedules() {
      for (const module of app.meta.modulesArray) {
        const config = app.meta.configs[module.info.relativeName];
        // module schedules
        if (config.schedules) {
          Object.keys(config.schedules).forEach(scheduleKey => {
            const fullKey = `${module.info.relativeName}:${scheduleKey}`;
            const scheduleConfig = config.schedules[scheduleKey];
            if (!scheduleConfig.disable && scheduleConfig.repeat) {
              app.meta.queue.push({
                module: moduleInfo.relativeName,
                queueName: 'schedule',
                jobName: fullKey,
                jobOptions: {
                  repeat: scheduleConfig.repeat,
                },
                data: {
                  module: module.info.relativeName,
                  schedule: scheduleKey,
                },
              });
            }
          });
        }
      }
    }

  }

  return Schedule;
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = app => {
  class Startup extends app.Service {

    async startupQueue({ key, startup, info }) {
      const cacheKey = `startupDebounce:${key}`;
      const debounce = typeof startup.debounce === 'number' ? startup.debounce : app.config.queue.startup.debounce;
      const flag = await this.ctx.cache.db.getset(cacheKey, true, debounce);
      if (flag) return;
      // perform
      await app.meta._runStartup(this.ctx, startup, info);
    }

  }

  return Startup;
};


/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const mparse = require3('egg-born-mparse').default;
const UserFn = __webpack_require__(19);

module.exports = app => {

  class Auth extends app.Service {

    // register all authProviders
    async installAuthProviders() {
      // registerAllRouters
      this._registerAllRouters();
      // registerAllProviders
      await this._registerAllProviders();
    }

    _registerAllRouters() {
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.auth && module.main.meta.auth.providers) {
          for (const providerName in module.main.meta.auth.providers) {
            this._registerProviderRouters(module.info.relativeName, providerName);
          }
        }
      }
    }

    _registerProviderRouters(moduleRelativeName, providerName) {
      // config
      const moduleInfo = mparse.parseInfo(moduleRelativeName);
      const config = {
        loginURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}`,
        callbackURL: `/api/${moduleInfo.url}/passport/${moduleRelativeName}/${providerName}/callback`,
      };
      // authenticate
      const authenticate = createAuthenticate(moduleRelativeName, providerName, config);
      // middlewares
      const middlewaresPost = [];
      const middlewaresGet = [];
      if (!this.ctx.app.meta.isTest) middlewaresPost.push('inner');
      middlewaresPost.push(authenticate);
      middlewaresGet.push(authenticate);
      // mount routes
      const routes = [
        { name: `get:${config.loginURL}`, method: 'get', path: '/' + config.loginURL, middlewares: middlewaresGet, meta: { auth: { enable: false } } },
        { name: `post:${config.loginURL}`, method: 'post', path: '/' + config.loginURL, middlewares: middlewaresPost, meta: { auth: { enable: false } } },
        { name: `get:${config.callbackURL}`, method: 'get', path: '/' + config.callbackURL, middlewares: middlewaresGet, meta: { auth: { enable: false } } },
        // { name: `post:${config.callbackURL}`, method: 'post', path: '/' + config.callbackURL, middlewares, meta: { auth: { enable: false } } },
      ];
      for (const route of routes) {
        this.app.meta.router.unRegister(route.name);
        this.app.meta.router.register(moduleInfo, route);
      }
    }

    async _registerAllProviders() {
      // all instances
      const instances = await this.ctx.model.query('select * from aInstance a where a.disabled=0');
      for (const instance of instances) {
        await this._registerInstanceProviders(instance.name, instance.id);
      }
    }

    async _registerInstanceProviders(subdomain, iid) {
      for (const relativeName in this.app.meta.modules) {
        const module = this.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.auth && module.main.meta.auth.providers) {
          for (const providerName in module.main.meta.auth.providers) {
            await this._registerInstanceProvider(subdomain, iid, module.info.relativeName, providerName);
          }
        }
      }
    }

    async _registerInstanceProvider(subdomain, iid, moduleRelativeName, providerName) {
      // provider of db
      const user = new (UserFn(this.ctx))();
      const providerItem = await user.getAuthProvider({
        subdomain,
        iid,
        module: moduleRelativeName,
        providerName,
      });
      if (!providerItem) return;
      // strategy
      const strategyName = `${iid}:${moduleRelativeName}:${providerName}`;
      // unuse/use
      if (providerItem.disabled === 0) {
        // module
        const module = this.app.meta.modules[moduleRelativeName];
        // provider
        const provider = module.main.meta.auth.providers[providerName];
        if (provider.handler) {
          // config
          const config = JSON.parse(providerItem.config);
          config.passReqToCallback = true;
          config.failWithError = false;
          config.successRedirect = config.successReturnToOrRedirect = (provider.meta.mode === 'redirect') ? '/' : false;
          // handler
          const handler = provider.handler(this.app);
          // use strategy
          this.app.passport.unuse(strategyName);
          this.app.passport.use(strategyName, new handler.strategy(config, handler.callback));
        }
      } else {
        // unuse strategy
        this.app.passport.unuse(strategyName);
      }
    }

    async register({ module, providerName }) {
      return await this.ctx.meta.user.registerAuthProvider({ module, providerName });
    }

    async providerChanged({ module, providerName }) {
      await this._registerInstanceProvider(this.ctx.subdomain, this.ctx.instance.id, module, providerName);
    }

  }

  return Auth;
};

function createAuthenticate(moduleRelativeName, providerName, _config) {
  return async function(ctx, next) {
    // provider of db
    const providerItem = await ctx.meta.user.getAuthProvider({
      module: moduleRelativeName,
      providerName,
    });
    if (!providerItem || providerItem.disabled !== 0) ctx.throw(423);

    // returnTo
    if (ctx.url.indexOf(_config.callbackURL) === -1) {
      if (ctx.request.query && ctx.request.query.returnTo) {
        ctx.session.returnTo = ctx.request.query.returnTo;
      } else {
        delete ctx.session.returnTo; // force to delete
      }
    }

    // module
    const module = this.app.meta.modules[moduleRelativeName];
    // provider
    const provider = module.main.meta.auth.providers[providerName];

    // config
    const config = JSON.parse(providerItem.config);
    config.passReqToCallback = true;
    config.failWithError = false;
    config.loginURL = ctx.meta.base.getAbsoluteUrl(_config.loginURL);
    config.callbackURL = ctx.meta.base.getAbsoluteUrl(_config.callbackURL);
    config.state = ctx.request.query.state;
    config.successRedirect = config.successReturnToOrRedirect = (provider.meta.mode === 'redirect') ? '/' : false;

    // config functions
    if (provider.configFunctions) {
      for (const key in provider.configFunctions) {
        config[key] = function(...args) {
          return provider.configFunctions[key](ctx, ...args);
        };
      }
    }

    // invoke authenticate
    const strategyName = `${ctx.instance.id}:${moduleRelativeName}:${providerName}`;
    const authenticate = ctx.app.passport.authenticate(strategyName, config);
    await authenticate(ctx, next);
  };
}



/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = app => {

  class Function extends app.Service {

    async list({ options, user }) {
      return await this.ctx.meta.function.list({ options, user });
    }

    async star({ id, star, user }) {
      return await this.ctx.meta.function.star({ id, star, user });
    }

    async check({ functions, user }) {
      return await this.ctx.meta.function.check({ functions, user });
    }

    async register({ module, name }) {
      return await this.ctx.meta.function.register({ module, name });
    }

    async setLocalesStartup() {
      await this.ctx.meta.function.setLocales({ reset: true });
    }

    async setLocalesQueue({ options }) {
      await this.ctx.meta.function.setLocalesQueue(options);
    }

    async scenes({ sceneMenu }) {
      return await this.ctx.meta.function.scenes({ sceneMenu });
    }

  }

  return Function;
};


/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const trimHtml = require3('@zhennann/trim-html');
const markdown = require3('@zhennann/markdown');
const markdonw_it_block = require3('@zhennann/markdown-it-block');

module.exports = app => {

  class Comment extends app.Service {

    async list({ key, options, user }) {
      const _options = {};
      // where
      _options.where = options.where || {};
      _options.where.iid = this.ctx.instance.id;
      _options.where.deleted = 0;
      _options.where.atomId = key.atomId;
      // orders
      _options.orders = options.orders;
      // page
      if (options.page.size !== 0) {
        _options.limit = options.page.size;
        _options.offset = options.page.index;
      }
      // sql
      const _where = this.ctx.model._where(_options.where);
      const _orders = this.ctx.model._orders(_options.orders);
      const _limit = this.ctx.model._limit(_options.limit, _options.offset);
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         ${_where} ${_orders} ${_limit}`;
      // select
      return await this.ctx.model.query(sql, [ this.ctx.instance.id, user.id ]);
    }

    async item({ key, data: { commentId }, user }) {
      const sql = `select a.*,(select d2.heart from aCommentHeart d2 where d2.iid=? and d2.commentId=a.id and d2.userId=?) as heart from aViewComment a
         where a.iid=? and a.deleted=0 and a.id=?`;
      // select
      const list = await this.ctx.model.query(sql,
        [ this.ctx.instance.id, user.id, this.ctx.instance.id, commentId ]
      );
      return list[0];
    }

    async save({ key, data, user }) {
      if (!data.commentId) {
        return await this.save_add({ key, data, user });
      }
      return await this.save_edit({ key, data, user });
    }

    async save_edit({ key, data: { commentId, content }, user }) {
      // comment
      const item = await this.ctx.model.commentView.get({ id: commentId });
      if (key.atomId !== item.atomId || item.userId !== user.id) this.ctx.throw(403);
      // html
      const html = this._renderContent({
        content,
        replyContent: item.replyContent,
        replyUserName: item.replyUserName,
      });
      // summary
      const summary = this._trimHtml(html);
      // update
      await this.ctx.model.comment.update({
        id: commentId,
        content,
        summary: summary.html,
        html,
        updatedAt: new Date(),
      });
      // ok
      return {
        action: 'update',
        atomId: key.atomId,
        commentId,
      };
    }

    async save_add({ key, data: { replyId, content }, user }) {
      // sorting
      const list = await this.ctx.model.query(
        'select max(sorting) as sorting from aComment where iid=? and deleted=0 and atomId=?',
        [ this.ctx.instance.id, key.atomId ]);
      const sorting = (list[0].sorting || 0) + 1;
      // reply
      let reply;
      if (replyId) {
        reply = await this.ctx.model.commentView.get({ id: replyId });
      }
      // replyContent
      const replyContent = !reply ? '' :
        this._fullContent({ content: reply.content, replyContent: reply.replyContent, replyUserName: reply.replyUserName });
      // html
      const html = this._renderContent({
        content,
        replyContent,
        replyUserName: reply && reply.userName,
      });
      // summary
      const summary = this._trimHtml(html);
      // create
      const res = await this.ctx.model.comment.insert({
        atomId: key.atomId,
        userId: user.id,
        sorting,
        heartCount: 0,
        replyId,
        replyUserId: reply ? reply.userId : 0,
        replyContent,
        content,
        summary: summary.html,
        html,
      });
      // commentCount
      await this.ctx.meta.atom.comment({ key, atom: { comment: 1 }, user });
      // ok
      return {
        action: 'create',
        atomId: key.atomId,
        commentId: res.insertId,
      };
    }

    async delete({ key, data: { commentId }, user }) {
      // comment
      const item = await this.ctx.model.comment.get({ id: commentId });
      // check right
      let canDeleted = (key.atomId === item.atomId && item.userId === user.id);
      if (!canDeleted) {
        canDeleted = await this.ctx.meta.function.checkRightFunction({
          function: { module: 'a-base', name: 'deleteComment' },
          user,
        });
      }
      if (!canDeleted) this.ctx.throw(403);
      // delete hearts
      await this.ctx.model.commentHeart.delete({ commentId });
      // delete comment
      await this.ctx.model.comment.delete({ id: commentId });
      // commentCount
      await this.ctx.meta.atom.comment({ key, atom: { comment: -1 }, user });
      // ok
      return {
        action: 'delete',
        atomId: key.atomId,
        commentId,
      };
    }

    async heart({ key, data: { commentId, heart }, user }) {
      let diff = 0;
      // check if exists
      const _heart = await this.ctx.model.commentHeart.get({
        userId: user.id,
        atomId: key.atomId,
        commentId,
      });
      if (_heart && !heart) {
        diff = -1;
        // delete
        await this.ctx.model.commentHeart.delete({
          id: _heart.id,
        });
      } else if (!_heart && heart) {
        diff = 1;
        // new
        await this.ctx.model.commentHeart.insert({
          userId: user.id,
          atomId: key.atomId,
          commentId,
          heart: 1,
        });
      }
      // get
      const item = await this.ctx.model.comment.get({ id: commentId });
      let heartCount = item.heartCount;
      if (diff !== 0) {
        heartCount += diff;
        await this.ctx.model.comment.update({
          id: commentId,
          heartCount,
        });
      }
      // ok
      return {
        action: 'heart',
        atomId: key.atomId,
        commentId,
        heart, heartCount,
      };
    }

    _fullContent({ content, replyContent, replyUserName }) {
      if (!replyContent) return content;
      return `${content}

> \`${replyUserName}\`:

::: comment-quot
${replyContent}
:::

`;
    }

    _renderContent({ content, replyContent, replyUserName }) {
      const _content = this._fullContent({ content, replyContent, replyUserName });
      const md = markdown.create();
      // block options
      const blockOptions = {
        utils: {
          text: (...args) => {
            return this.ctx.text(...args);
          },
        },
      };
      md.use(markdonw_it_block, blockOptions);
      // render
      return md.render(_content);
    }

    _trimHtml(html) {
      return trimHtml(html, this.ctx.config.comment.trim);
    }

  }

  return Comment;
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

const require3 = __webpack_require__(0);
const extend = require3('extend2');

module.exports = app => {

  class Settings extends app.Service {

    async load({ module, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      return await this.ctx.meta.status.get(name);
    }

    async save({ module, data, user }) {
      const name = `user-layoutConfig:${module}:${user.id}`;
      await this.ctx.meta.status.set(name, data);
    }

    async saveKey({ module, key, value, user }) {
      const layoutConfig = await this.load({ module, user });
      const data = extend(true, {}, layoutConfig || {}, { [key]: value });
      await this.save({ module, data, user });
    }

  }

  return Settings;
};


/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

const atom = __webpack_require__(5);
const atomAction = __webpack_require__(4);
const atomClass = __webpack_require__(3);
const auth = __webpack_require__(22);
const authProvider = __webpack_require__(23);
const role = __webpack_require__(13);
const roleInc = __webpack_require__(14);
const roleIncRef = __webpack_require__(88);
const roleRef = __webpack_require__(89);
const roleRight = __webpack_require__(16);
const roleRightRef = __webpack_require__(17);
const user = __webpack_require__(20);
const userAgent = __webpack_require__(21);
const userRole = __webpack_require__(15);
const label = __webpack_require__(90);
const atomLabel = __webpack_require__(7);
const atomLabelRef = __webpack_require__(8);
const atomStar = __webpack_require__(6);
const func = __webpack_require__(2);
const functionStar = __webpack_require__(10);
const functionLocale = __webpack_require__(11);
const functionScene = __webpack_require__(12);
const roleFunction = __webpack_require__(18);
const comment = __webpack_require__(91);
const commentView = __webpack_require__(92);
const commentHeart = __webpack_require__(93);

module.exports = app => {
  const models = {
    atom,
    atomAction,
    atomClass,
    auth,
    authProvider,
    role,
    roleInc,
    roleIncRef,
    roleRef,
    roleRight,
    roleRightRef,
    user,
    userAgent,
    userRole,
    label,
    atomLabel,
    atomLabelRef,
    atomStar,
    function: func,
    functionStar,
    functionLocale,
    functionScene,
    roleFunction,
    comment,
    commentView,
    commentHeart,
  };
  return models;
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleIncRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleIncRef', options: { disableDeleted: true } });
    }

  }

  return RoleIncRef;
};


/***/ }),
/* 89 */
/***/ (function(module, exports) {

module.exports = app => {

  class RoleRef extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRoleRef', options: { disableDeleted: true } });
    }

    async getParent({ roleId, level = 1 }) {
      const roleRef = await this.get({
        roleId,
        level,
      });
      return roleRef;
    }

  }

  return RoleRef;
};


/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = app => {

  class Label extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aLabel', options: { disableDeleted: true } });
    }

  }

  return Label;
};


/***/ }),
/* 91 */
/***/ (function(module, exports) {

module.exports = app => {

  class Comment extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aComment', options: { disableDeleted: false } });
    }

  }

  return Comment;
};


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = app => {

  class CommentView extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aViewComment', options: { disableDeleted: false } });
    }

  }

  return CommentView;
};


/***/ }),
/* 93 */
/***/ (function(module, exports) {

module.exports = app => {

  class CommentHeart extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aCommentHeart', options: { disableDeleted: true } });
    }

  }

  return CommentHeart;
};


/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = app => {
  // keywords
  const keywords = __webpack_require__(95)(app);
  // schemas
  const schemas = __webpack_require__(96)(app);
  // meta
  const meta = {
    base: {
      functions: {
        listComment: {
          title: 'Comment List',
          scene: 'list',
          sorting: 1,
          menu: 1,
          actionPath: 'comment/all',
        },
        deleteComment: {
          title: 'Delete Comment',
          menu: 0,
        },
      },
    },
    sequence: {
      providers: {
        draft: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
        userName: {
          start: 0,
          expression({ ctx, value }) {
            return ++value;
          },
        },
      },
    },
    validation: {
      validators: {
        user: {
          schemas: 'user',
        },
      },
      keywords: {
        'x-exists': keywords.exists,
      },
      schemas: {
        user: schemas.user,
      },
    },
    event: {
      declarations: {
        loginInfo: 'Login Info',
        userVerify: 'User Verify',
        atomClassValidator: 'Atom Validator',
      },
    },
  };
  return meta;
};


/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = app => {
  const keywords = {};
  keywords.exists = {
    async: true,
    type: 'string',
    errors: true,
    compile() {
      return async function(data, path, rootData, name) {
        const ctx = this;
        const res = await ctx.meta.user.exists({ [name]: data });
        if (res && res.id !== ctx.user.agent.id) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Element Exists') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        if (!res && data.indexOf('__') > -1) {
          const errors = [{ keyword: 'x-exists', params: [], message: ctx.text('Cannot Contain __') }];
          throw new app.meta.ajv.ValidationError(errors);
        }
        return true;
      };
    },
  };
  return keywords;
};


/***/ }),
/* 96 */
/***/ (function(module, exports) {

module.exports = app => {
  const schemas = {};
  // user
  schemas.user = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
        'x-exists': true,
        ebReadOnly: true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
        notEmpty: true,
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        // notEmpty: true,
        // format: 'email',
        'x-exists': true,
        ebReadOnly: true,
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        // notEmpty: true,
        'x-exists': true,
        ebReadOnly: true,
      },
      motto: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Motto',
      },
      locale: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Locale',
        ebOptionsUrl: '/a/base/base/locales',
        ebOptionsUrlParams: null,
        ebOptionsBlankAuto: true,
      },
    },
  };

  return schemas;
};


/***/ })
/******/ ]);
//# sourceMappingURL=backend.js.map