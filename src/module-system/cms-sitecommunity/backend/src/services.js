const version = require('./service/version.js');
const post = require('./service/post.js');
const event = require('./service/event.js');

module.exports = app => {
  const services = {
    version,
    post,
    event,
  };
  return services;
};
