module.exports = app => {
  const schemas = {};
  schemas.mailScene = {
    type: 'object',
    properties: {
      transport: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'MailTransportInfo',
        properties: {
          title: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Title',
            notEmpty: true,
          },
          host: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailHost',
            notEmpty: true,
          },
          port: {
            type: 'number',
            ebType: 'text',
            ebTitle: 'MailPort',
            notEmpty: true,
          },
          secure: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'MailSecure',
          },
        },
      },
      auth: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Auth Info',
        properties: {
          user: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailAuthUser',
            notEmpty: true,
          },
          pass: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'MailAuthPassword',
            notEmpty: true,
          },
        },
      },
      __groupDefaultsInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Defaults Info',
      },
      defaults: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Defaults',
      },
      extra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Info',
        properties: {
          logger: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'logger',
          },
          debug: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'debug',
          },
        },
      },
    },
  };
  return schemas;
};
