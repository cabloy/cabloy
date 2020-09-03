const version = require('./controller/version.js');
const post = require('./controller/post.js');

module.exports = app => {
  const controllers = {
    version,
    post,
  };
  return controllers;
};
