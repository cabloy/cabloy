const version = require('./service/version.js');
const article = require('./service/article.js');

module.exports = app => {
  const services = {
    version,
    article,
  };
  return services;
};
