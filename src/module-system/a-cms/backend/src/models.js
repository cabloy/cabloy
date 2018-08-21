const article = require('./model/article.js');

module.exports = app => {
  const models = {
    article,
  };
  return models;
};
