const article = require('./model/article.js');
const category = require('./model/category.js');

module.exports = app => {
  const models = {
    article,
    category,
  };
  return models;
};
