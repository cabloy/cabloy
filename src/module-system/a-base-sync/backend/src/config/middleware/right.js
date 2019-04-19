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
    const res = await ctx.meta.atom.checkRightCreate({
      atomClass: {
        id: atomClassId,
      },
      user: ctx.user.op,
    });
    if (!res) ctx.throw(403);
    ctx.meta._atomClass = res;
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
  const res = await ctx.meta.function.checkRightFunction({
    function: {
      module: options.module || ctx.module.info.relativeName,
      name: options.name || ctx.request.body.name },
    user: ctx.user.op,
  });
  if (!res) ctx.throw(403);
  ctx.meta._function = res;
}
