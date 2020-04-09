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

// user
const AuthFn = require('./adapter/auth.js');
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
