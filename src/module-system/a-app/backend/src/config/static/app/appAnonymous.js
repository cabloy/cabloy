module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {};
  const _app = {
    atomName: 'Anonymous',
    atomStaticKey: 'appAnonymous',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return _app;
};
