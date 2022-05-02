module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {};
  const _app = {
    atomName: 'Base',
    atomStaticKey: 'appBase',
    atomRevision: 0,
    description: '',
    appIcon: null,
    appIsolate: true,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return _app;
};
