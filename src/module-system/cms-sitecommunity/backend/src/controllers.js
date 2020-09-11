const post = require('./controller/post.js');

module.exports = app => {
  const controllers = {
    post,
  };
  return controllers;
};
