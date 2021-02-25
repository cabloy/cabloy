module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const workflow = {
    info: {
      bean: 'workflow',
      title: 'WorkFlow',
      persistence: true,
      uniform: true,
      stats: {
        params: {
          module: 'a-message',
          name: 'message',
          nameSub: `${moduleInfo.relativeName}_workflow`,
        },
        color: 'red',
      },
    },
  };
  return workflow;
};
