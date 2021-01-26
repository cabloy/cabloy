module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    login: '/a/login/login',
    loginOnStart: true,
    toolbar: {
      meta: {
        tabbar: true, labels: true, bottom: true,
      },
      buttonActive: 'a-layoutmobile:buttonAtom',
      buttons: [
        { module: 'a-layoutmobile', name: 'buttonHome' },
        { module: 'a-layoutmobile', name: 'buttonAtom' },
        { module: 'a-layoutmobile', name: 'buttonMine' },
      ],
    },
    size: {
      small: 320,
    },
  };
  const layout = {
    atomName: 'Mobile Layout',
    atomStaticKey: 'layoutMobile',
    atomRevision: 0,
    description: '',
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
