const file = require('./controller/file.js');


module.exports = app => {
  const controllers = {
    file,
  };
  return controllers;
};
