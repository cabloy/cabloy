module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'User/Password',
          inline: true,
          mode: 'direct',
          bean: {
            module: moduleInfo.relativeName,
            name: 'simple',
          },
          render: {
            module: moduleInfo.relativeName,
            name: 'blockSignin',
          },
        },
      },
    },
  };
};
