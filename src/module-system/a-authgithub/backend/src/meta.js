const auth = require('./meta/passport/auth.js');
const schemas = require('./meta/validation/schemas.js');
module.exports = {
  auth,
  validation: {
    validators: {},
    schemas,
  },
};
