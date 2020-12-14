const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    // schemas
    const schemas = require('./config/validation/schemas.js')(app);
    // keywords
    const keywords = require('./config/validation/keywords.js')(app);
    // socketio
    const socketioTest = require('./config/socketio/test.js')(app);
    // static
    const staticDashboards = require('./config/static/dashboards.js')(app);
    const staticResources = require('./config/static/resources.js')(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          party: {
            info: {
              bean: 'party',
              title: 'Party',
              tableName: 'testParty',
              tableNameModes: {
                default: 'testPartyView',
              },
              language: false,
              category: true,
              tag: true,
            },
            actions: {
            },
            validator: 'party',
            search: {
              validator: 'partySearch',
            },
          },
        },
        statics: {
          'a-dashboard.dashboard': {
            items: staticDashboards,
          },
          'a-base.resource': {
            items: staticResources,
          },
        },
      },
      validation: {
        validators: {
          party: {
            schemas: 'party',
          },
          partySearch: {
            schemas: 'partySearch',
          },
          userTest: {
            schemas: 'settingsUser,settingsUserExtra',
          },
          instanceTest: {
            schemas: 'settingsInstance',
          },
          formTest: {
            schemas: 'formTest',
          },
          formCaptchaTest: {
            schemas: 'formCaptchaTest',
          },
          formMobileVerifyTest: {
            schemas: 'formMobileVerifyTest',
          },
        },
        keywords: {
          'x-languages': keywords.languages,
        },
        schemas: {
          party: schemas.party,
          partySearch: schemas.partySearch,
          settingsUser: schemas.settingsUser,
          settingsUserExtra: schemas.settingsUserExtra,
          settingsInstance: schemas.settingsInstance,
          formTest: schemas.formTest,
          formCaptchaTest: schemas.formCaptchaTest,
          formMobileVerifyTest: schemas.formMobileVerifyTest,
        },
      },
      settings: {
        user: {
          validator: 'userTest',
        },
        instance: {
          validator: 'instanceTest',
        },
      },
      event: {
        implementations: {
          'a-base:loginInfo': 'loginInfoDashboard',
        },
      },
      index: {
        indexes: {
          testParty: 'createdAt,updatedAt,atomId,partyTypeId',
        },
      },
      socketio: {
        messages: {
          test: socketioTest,
        },
      },
      stats: {
        providers: {
          tasksUser: {
            user: true,
            bean: 'tasksUser',
          },
          tasksInstance: {
            user: false,
            bean: 'tasksInstance',
            dependencies: 'tasksUser',
          },
        },
      },
    });
  }
  if (app.meta.isTest) {
    // meta
    extend(true, meta, {
      base: {
      },
      event: {
        declarations: {
          hello: 'This is a test for event',
        },
        implementations: {
          'test-party:hello': 'helloEcho',
          'a-base:userVerify': 'userVerify',
          'a-base:loginInfo': 'loginInfo',
        },
      },
      sequence: {
        providers: {
          test: {
            bean: 'test',
            start: 0,
          },
        },
      },
    });
  }
  return meta;
};
