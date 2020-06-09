const wxworkDepartment = require('./model/wxworkDepartment.js');
const auth = require('./model/auth.js');

module.exports = app => {
  const models = {
    wxworkDepartment,
    auth,
  };
  return models;
};
