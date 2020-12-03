const article = require('./model/article.js');
const content = require('./model/content.js');

module.exports = app => {
  const models = {
    article,
    content,
  };
  return models;
};
