module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // meta
  const meta = {
    validation: {
      validators: {},
      keywords: {},
      schemas: {
        filterTabBasic: schemas.filterTabBasic,
        filterTabGeneral: schemas.filterTabGeneral,
      },
    },
  };

  return meta;
};
