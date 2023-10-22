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
          bean: 'sms',
          render: 'blockSignin',
          icon: { f7: ':auth:sms' },
        },
      },
    },
  };
};
