module.exports = app => {
  const meta = {
    base: {
      functions: {
        settings: {
          title: 'Settings',
          scene: 'tools',
          actionPath: 'instance/list',
          sorting: 10,
          menu: 1,
        },
      },
    },
  };
  return meta;
};
