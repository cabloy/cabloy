const version = require('./service/version.js');
const post = require('./service/post.js');

module.exports = app => {
  const services = {
    version,
    post,
  };
  return services;
};
