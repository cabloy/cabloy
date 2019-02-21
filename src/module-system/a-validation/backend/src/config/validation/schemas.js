module.exports = app => {
  const schemas = {};
  schemas.root = {
    type: 'object',
    ebTitle: 'test',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'User Name',
            ebDescription: 'Your name',
            notEmpty: true,
          },
          password: {
            type: 'string',
            ebType: 'text',
            ebSecure: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
          },
        },
      },
      extra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Group',
        properties: {
          extra: {
            ebType: 'panel',
            $ref: 'extra',
          },
        },
      },
    },
  };
  schemas.extra = {
    type: 'object',
    ebTitle: 'extra',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          language: {
            type: 'string',
            ebType: 'select',
            ebOptionsUrl: 'test/languages',
            notEmpty: true,
            'x-languages': true,
          },
        },
        required: [ 'language' ],
      },
    },
  };
  return schemas;
};
