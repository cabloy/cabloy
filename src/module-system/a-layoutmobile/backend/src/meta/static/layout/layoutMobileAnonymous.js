// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    toolbar: {
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonAppMenu' },
        { module: 'a-layoutmobile', name: 'buttonAppHome' },
        { module: 'a-layoutmobile', name: 'buttonAppMine' },
      ],
    },
  };
  const layout = {
    atomName: 'Mobile Layout(Anonymous)',
    atomStaticKey: 'layoutMobileAnonymous',
    atomRevision: 8,
    description: '',
    layoutTypeCode: 1,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
