const version = require('./controller/version.js');
const file = require('./controller/file.js');


module.exports = app => {
  const controllers = {
    version,
    file,
  };
  return controllers;
};
