const post = require('./service/post.js');

module.exports = app => {
  const services = {
    post,
  };
  return services;
};
