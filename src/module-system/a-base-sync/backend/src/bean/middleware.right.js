// request.body
//   key: atomId itemId
//   atomClass: id,module,atomClassName,atomClassIdParent
//   item:
// options
//   type: atom/function
//   action(atom):
//   name(function):
//   module:
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // ignore
      if (!options.type) return await next();

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
}

async function checkAtom(moduleInfo, options, ctx) {
  // constant
  const constant = ctx.constant.module(moduleInfo.relativeName);

  // create
  if (options.action === constant.atom.action.create) {
    // atomClassId
    let atomClassId = ctx.request.body.atomClass.id;
    if (!atomClassId) {
      const res = await ctx.bean.atomClass.get({
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
      const res = await ctx.bean.atom.checkRightCreateRole({
        atomClass: {
          id: atomClassId,
        },
        roleIdOwner,
        user: ctx.state.user.op,
      });
      if (!res) ctx.throw(403);
      ctx.meta._atomClass = res;
    } else {
      // retrieve default one
      const roles = await ctx.bean.atom.preferredRoles({
        atomClass: {
          id: atomClassId,
        },
        user: ctx.state.user.op,
      });
      if (roles.length === 0) ctx.throw(403);
      ctx.request.body.roleIdOwner = roles[0].roleIdWho;
      ctx.meta._atomClass = { id: atomClassId };
    }
    return;
  }

  // read
  if (options.action === constant.atom.action.read) {
    const res = await ctx.bean.atom.checkRightRead({
      atom: { id: ctx.request.body.key.atomId },
      user: ctx.state.user.op,
      checkFlow: options.checkFlow,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.meta._atom = res;
    return;
  }

  // other action (including write/delete)
  if (!ctx.request.body.key && !ctx.request.body.atomClass) ctx.throw.module(moduleInfo.relativeName, 1011);
  const actionOther = options.action;
  const bulk = !ctx.request.body.key;
  if (bulk) {
    const res = await ctx.bean.atom.checkRightActionBulk({
      atomClass: ctx.request.body.atomClass,
      action: actionOther,
      user: ctx.state.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.meta._atomAction = res;
  } else {
    const res = await ctx.bean.atom.checkRightAction({
      atom: { id: ctx.request.body.key.atomId },
      action: actionOther, stage: options.stage,
      user: ctx.state.user.op,
      checkFlow: options.checkFlow,
    });
    if (!res) ctx.throw(403);
    ctx.request.body.key.itemId = res.itemId;
    ctx.meta._atom = res;
  }

}

async function checkResource(moduleInfo, options, ctx) {
  if (ctx.innerAccess) return;
  let resourceAtomId;
  let atomStaticKey;
  if (options.useKey) {
    resourceAtomId = ctx.request.body.key.atomId;
  } else {
    atomStaticKey = options.atomStaticKey;
    if (!atomStaticKey && options.name) {
      atomStaticKey = `${options.module || ctx.module.info.relativeName}:${options.name}`;
    }
  }
  if (!resourceAtomId && !atomStaticKey) ctx.throw(403);
  const res = await ctx.bean.resource.checkRightResource({
    resourceAtomId,
    atomStaticKey,
    user: ctx.state.user.op,
  });
  if (!res) ctx.throw(403);
  ctx.meta._resource = res;
}
