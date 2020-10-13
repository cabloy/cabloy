const require3 = require('require3');
const extend = require3('extend2');

module.exports = app => {
  const meta = {
  };
  if (app.meta.isTest || app.meta.isLocal) {
    const schemas = require('./config/validation/schemas.js')(app);
    const flowDefinitions = require('./config/flow/definitions.js')(app);
    // meta
    extend(true, meta, {
      base: {
        atoms: {
          trip: {
            info: {
              bean: 'trip',
              title: 'Trip',
              tableName: 'testTrip',
            },
            actions: {
            },
            validator: 'trip',
            search: {
              validator: 'tripSearch',
            },
          },
        },
        functions: {
          createTrip: {
            title: 'Create Trip',
            scene: 'create',
            autoRight: 1,
            atomClassName: 'trip',
            action: 'create',
            sorting: 1,
            menu: 1,
          },
          listTrip: {
            title: 'Trip List',
            scene: 'list',
            autoRight: 1,
            atomClassName: 'trip',
            action: 'read',
            sorting: 1,
            menu: 1,
          },
        },
      },
      validation: {
        validators: {
          trip: {
            schemas: 'trip',
          },
          tripSearch: {
            schemas: 'tripSearch',
          },
        },
        keywords: {},
        schemas: {
          trip: schemas.trip,
          tripSearch: schemas.tripSearch,
        },
      },
      flow: {
        definitions: flowDefinitions,
      },
    });
  }
  return meta;
};
