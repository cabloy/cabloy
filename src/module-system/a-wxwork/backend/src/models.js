const department = require('./model/department.js');

module.exports = app => {
  const models = {
    department,
  };
  return models;
};
