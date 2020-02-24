module.exports = app => {
  const schemas = {};
  // party
  schemas.party = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Party Name',
        notEmpty: true,
      },
      personCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Person Count',
        notEmpty: true,
      },
      partyTypeId: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Party Type',
        ebOptionsUrl: '/test/party/party/types',
        ebOptionTitleKey: 'name',
        ebOptionValueKey: 'id',
        ebOptionsBlankAuto: true,
        notEmpty: true,
      },
    },
  };
  // party search
  schemas.partySearch = {
    type: 'object',
    properties: {
      partyTypeId: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Party Type',
        ebOptionsUrl: '/test/party/party/types',
        ebOptionTitleKey: 'name',
        ebOptionValueKey: 'id',
        ebOptionsBlankAuto: true,
      },
    },
  };

  // settings
  schemas.settingsUser = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          username: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'My Name',
            notEmpty: true,
          },
        },
      },
      groupExtra: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Extra Group',
        properties: {
          panelExtra: {
            ebType: 'panel',
            ebTitle: 'Extra',
            $ref: 'settingsUserExtra',
          },
        },
      },
    },
  };
  schemas.settingsUserExtra = {
    type: 'object',
    ebTitle: 'Extra',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          mobile: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Mobile',
            notEmpty: true,
          },
          sex: {
            type: 'number',
            ebType: 'select',
            ebTitle: 'Sex',
            ebMultiple: false,
            ebOptions: [
              { title: 'Male', value: 1 },
              { title: 'Female', value: 2 },
            ],
            ebParams: {
              openIn: 'page',
              closeOnSelect: true,
            },
            notEmpty: true,
          },
          language: {
            type: 'string',
            ebType: 'select',
            ebTitle: 'Language',
            ebOptionsUrl: '/a/base/base/locales',
            ebOptionsUrlParams: null,
            'x-languages': true,
            notEmpty: true,
          },
        },
      },
    },
  };
  schemas.settingsInstance = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          slogan: {
            type: 'string',
            ebType: 'text',
            ebTitle: 'Slogan',
            notEmpty: true,
          },
        },
      },
    },
  };
  schemas.formTest = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
      passwordAgain: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password again',
        ebSecure: true,
        notEmpty: true,
        const: { $data: '1/password' },
      },
      sex: {
        type: 'number',
        ebType: 'select',
        ebTitle: 'Sex',
        ebMultiple: false,
        ebOptions: [
          { title: 'Male', value: 1 },
          { title: 'Female', value: 2 },
        ],
        ebOptionsBlankAuto: true,
        ebParams: {
          openIn: 'page',
          closeOnSelect: true,
        },
        notEmpty: true,
      },
      birthday: {
        type: 'string',
        ebType: 'datepicker',
        ebTitle: 'Birthday',
        ebParams: {
          dateFormat: 'DD, MM dd, yyyy',
          header: false,
          toolbar: false,
          // backdrop: true,
        },
        format: 'date-time',
        // notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Language',
        ebOptionsUrl: '/a/base/base/locales',
        ebOptionsUrlParams: null,
        ebOptionsBlankAuto: true,
        'x-languages': true,
        // notEmpty: true,
      },
      avatar: {
        type: 'string',
        ebType: 'file',
        ebTitle: 'Avatar',
        ebParams: { mode: 1 },
        notEmpty: true,
      },
      rememberMe: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Remember me',
      },
    },
  };
  schemas.formCaptchaTest = {
    type: 'object',
    properties: {
      userName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      password: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Password',
        ebSecure: true,
        notEmpty: true,
        minLength: 6,
      },
    },
  };

  return schemas;
};
