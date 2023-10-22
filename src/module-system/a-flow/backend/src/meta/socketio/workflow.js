module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const workflow = {
    info: {
      title: 'WorkFlows',
      persistence: true,
      uniform: {
        stats: {
          params: {
            module: 'a-message',
            name: 'message',
            nameSub: `${moduleInfo.relativeName}_workflow`,
          },
          color: 'red',
        },
      },
    },
  };
  return workflow;
};
