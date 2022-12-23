const resource = require('./controller/resource.js');
module.exports = app => {
  const controllers = { resource };
  return controllers;
};
