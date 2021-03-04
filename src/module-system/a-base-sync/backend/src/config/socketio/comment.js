module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const comment = {
    info: {
      title: 'Comments',
      persistence: true,
      uniform: {
        stats: {
          params: {
            module: 'a-message',
            name: 'message',
            nameSub: `${moduleInfo.relativeName}_comment`,
          },
          color: 'red',
        },
      },
    },
  };
  return comment;
};
