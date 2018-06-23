// base
const BaseFn = require('./adapter/base.js');
const BASE = Symbol('CTX#__BASE');

// atomClass
const AtomClassFn = require('./adapter/atomClass.js');
const ATOMCLASS = Symbol('CTX#__ATOMCLASS');

// atomClass
const AtomActionFn = require('./adapter/atomAction.js');
const ATOMACTION = Symbol('CTX#__ATOMACTION');

// atom
const AtomFn = require('./adapter/atom.js');
const ATOM = Symbol('CTX#__ATOM');

// function
const FunctionFn = require('./adapter/function.js');
const FUNCTION = Symbol('CTX#__FUNCTION');

// role
const RoleFn = require('./adapter/role.js');
const ROLE = Symbol('CTX#__ROLE');

// user
const UserFn = require('./adapter/user.js');
const USER = Symbol('CTX#__USER');

// util
const UtilFn = require('./adapter/util.js');
const UTIL = Symbol('CTX#__UTIL');

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
