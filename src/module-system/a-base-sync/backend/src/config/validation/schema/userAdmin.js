module.exports = app => {
  const schemas = {};
  // userAdmin
  schemas.userAdmin = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      realName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Realname',
      },
      avatar: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Avatar',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      email: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Email',
        // notEmpty: true,
        // format: 'email',
      },
      mobile: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Mobile',
        // notEmpty: true,
      },
      motto: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Motto',
      },
      locale: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Locale',
        ebOptionsUrl: '/a/base/base/locales',
      },
    },
  };
  return schemas;
};
