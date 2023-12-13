module.exports = app => {
  const moduleInfo = module.info;
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
