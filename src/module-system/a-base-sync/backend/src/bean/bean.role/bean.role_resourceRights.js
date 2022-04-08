module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const __atomClassRole = {
    module: moduleInfo.relativeName,
    atomClassName: 'role',
  };
  const __atomClassUser = {
    module: moduleInfo.relativeName,
    atomClassName: 'user',
  };

  class Role {}

  return Role;
};
