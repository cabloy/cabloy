const department = require('./model/department.js');
const member = require('./model/member.js');

module.exports = app => {
  const models = {
    department,
    member,
  };
  return models;
};
