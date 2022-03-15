module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const provider = moduleInfo.name;
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'SMS',
          inline: true,
          mode: 'direct',
          bean: {
            module: moduleInfo.relativeName,
            name: 'sms',
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
