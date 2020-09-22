module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const flowDefinitions = require('./config/flow/definitions.js')(app);
  const meta = {
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
          flags: {
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
      definitions: {
        simple: flowDefinitions.simple,
      },
    },
  };
  return meta;
};
