// request.body
//   key: atomId itemId
//   atomClass: id,module,atomClassName
//   item:
// options
//   type: atom/resource/detail
//   action(atom):
//   name(function):
//   module:
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // ignore
      if (!options.type) {
        // isAuthOpen
        const isAuthOpen = ctx.bean.authOpen.isAuthOpen();
        if (isAuthOpen && !options.enableAuthOpen && !ctx.innerAccess) return ctx.throw(403);
        // others
        return await next();
      }

      const types = options.type.split(',');
      if (types.length === 1) {
        await checkRight(types[0], moduleInfo, options, ctx);
      } else {
        let error;
        for (const type of types) {
          try {
            await checkRight(type, moduleInfo, options, ctx);
            // ok
            error = null;
            break;
          } catch (err) {
            error = err;
          }
        }
        if (error) throw error;
      }

      // next
      await next();
    }
  }
  return Middleware;
};

async function checkRight(type, moduleInfo, options, ctx) {
  // atom
  if (type === 'atom') await checkAtom(moduleInfo, options, ctx);

  // resource
  if (type === 'resource') await checkResource(moduleInfo, options, ctx);

  // detail
  if (type === 'detail') await checkDetail(moduleInfo, options, ctx);
}

async function checkAtom(moduleInfo, options, ctx) {
  // constant
  const constant = ctx.constant.module(moduleInfo.relativeName);

  const { atomKey, atomClass, atomClassBase } = await _checkAtomClassExpect({ options, ctx });

  // create
  if (options.action === 'create' || options.action === constant.atom.action.create) {
    // atomClassId
    const atomClassId = atomClass.id;
    // roleIdOwner
    const roleIdOwner = ctx.request.body.roleIdOwner;
    if (roleIdOwner) {
      // check
      const res = await ctx.bean.atom.checkRightCreateRole({
        atomClass: {
          id: atomClassId,
        },
        roleIdOwner,
        user: ctx.state.user.op,
      });
      if (!res) ctx.throw(403);
    } else {
      // retrieve default one, must exists
      const roleId = await ctx.bean.atom.preferredRoleId({
        atomClass: {
          id: atomClassId,
        },
        user: ctx.state.user.op,
      });
      if (roleId === 0) ctx.throw(403);
      ctx.request.body.roleIdOwner = roleId;
    }
    return;
  }

  // read
  if (options.action === 'read' || options.action === constant.atom.action.read) {
    const res = await ctx.bean.atom.checkRightRead({
      atom: { id: atomKey.atomId },
      user: ctx.state.user.op,
      checkFlow: options.checkFlow,
    });
    if (!res) ctx.throw(403);
    atomKey.itemId = res.itemId;
    return;
  }

  // other action (including write/delete)
  const actionOther = options.action;
  const bulk = !atomKey;
  if (bulk) {
    const res = await ctx.bean.atom.checkRightActionBulk({
      atomClass,
      action: actionOther,
      stage: options.stage,
      user: ctx.state.user.op,
    });
    if (!res) ctx.throw(403);
  } else {
    const res = await ctx.bean.atom.checkRightAction({
      atom: { id: atomKey.atomId },
      action: actionOther,
      stage: options.stage,
      user: ctx.state.user.op,
      checkFlow: options.checkFlow,
    });
    if (!res) ctx.throw(403);
    atomKey.itemId = res.itemId;
  }
}

async function checkResource(moduleInfo, options, ctx) {
  if (ctx.innerAccess) return;
  // useKey
  if (options.useKey) {
    const resourceAtomId = ctx.request.body.key.atomId;
    const res = await _checkResource({ resourceAtomId, ctx });
    if (!res) ctx.throw(403);
    ctx.meta._resource = res;
    return;
  }
  // atomStaticKey/name
  if (!options.atomStaticKey && !options.name) ctx.throw(403);
  let atomStaticKeys = options.atomStaticKey;
  if (!atomStaticKeys && options.name) {
    const names = options.name.split(',');
    atomStaticKeys = names.map(name => {
      return `${options.module || ctx.module.info.relativeName}:${name}`;
    });
  }
  if (!Array.isArray(atomStaticKeys)) {
    atomStaticKeys = atomStaticKeys.split(',');
  }
  let res;
  for (const atomStaticKey of atomStaticKeys) {
    res = await _checkResource({ atomStaticKey, ctx });
    if (res) break; // ok when any passed
  }
  if (!res) ctx.throw(403);
  ctx.meta._resource = res;
}

async function _checkResource({ resourceAtomId, atomStaticKey, ctx }) {
  return await ctx.bean.resource.checkRightResource({
    resourceAtomId,
    atomStaticKey,
    user: ctx.state.user.op,
  });
}

async function checkDetail(moduleInfo, options, ctx) {
  await ctx.bean.detail._checkRightForMiddleware({ options });
}

function _parseAtomClass(atomClass) {
  if (!atomClass) return atomClass;
  if (typeof atomClass === 'string') {
    const [module, atomClassName] = atomClass.split(':');
    return { module, atomClassName };
  }
  return atomClass;
}

function _checkIfSameAtomClass(atomClassA, atomClassB) {
  return atomClassA.module === atomClassB.module && atomClassA.atomClassName === atomClassB.atomClassName;
}

async function _checkAtomClassExpect({ options, ctx }) {
  // atomClassExpect
  const atomClassExpect = _parseAtomClass(options.atomClass);
  // atomKey
  const atomKey = ctx.request.body.key;
  // atomClass: support itemOnly
  let atomClass = ctx.request.body.atomClass;
  if (atomClass) {
    atomClass = await ctx.bean.atomClass.get(atomClass);
  } else if (atomKey) {
    atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: atomKey.atomId });
  }
  // check if valid & same
  if (!atomClass && !atomClassExpect) ctx.throw(403);
  if (atomClass && atomClassExpect && !_checkIfSameAtomClass(atomClass, atomClassExpect)) {
    ctx.throw(403);
  }
  // neednot check !!atomClassExpect
  if (!atomClass) {
    atomClass = await ctx.bean.atomClass.get(atomClassExpect);
  }
  // force consistent for safe
  ctx.request.body.atomClass = atomClass;
  // atomClassBase
  const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
  // ok
  return {
    atomKey,
    atomClass,
    atomClassBase,
  };
}
