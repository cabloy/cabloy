module.exports = app => {
  const schemas = {};
  schemas.user = {
    type: 'object',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebDescription: '',
            notEmpty: true,
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
            ebTitle: 'Extra',
            $ref: 'userExtra',
          },
        },
      },
    },
  };
  schemas.userExtra = {
    type: 'object',
    ebTitle: 'Extra',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          mobile: {
            type: 'string',
            ebType: 'text',
            notEmpty: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebMultiple: false,
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
            ebParams: {
              openIn: 'page',
              closeOnSelect: true,
            },
          },
          language: {
            type: 'string',
            ebType: 'select',
            ebOptionsUrl: '/a/base/base/locales',
            ebOptionsUrlParams: null,
            'x-languages': true,
          },
        },
        required: [ 'language' ],
      },
    },
  };
  schemas.instance = {
    type: 'object',
    properties: {
      info: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          title: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'title',
            ebDescription: 'website\'s title',
            notEmpty: true,
          },
        },
      },
    },
  };
  return schemas;
};
