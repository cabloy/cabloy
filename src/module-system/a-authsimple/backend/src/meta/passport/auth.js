module.exports = app => {
  const moduleInfo = module.info;
  const provider = moduleInfo.name;
  return {
    providers: {
      [provider]: {
        meta: {
          title: 'User/Password',
          inline: true,
          mode: 'direct',
          bean: 'simple',
          render: 'blockSignin',
          icon: { f7: ':auth:password' },
        },
      },
    },
  };
};
