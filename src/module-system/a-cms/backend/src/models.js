const article = require('./model/article.js');
const category = require('./model/category.js');
const content = require('./model/content.js');

module.exports = app => {
  const models = {
    article,
    category,
    content,
  };
  return models;
};
