const article = require('./model/article.js');
const category = require('./model/category.js');
const content = require('./model/content.js');
const tag = require('./model/tag.js');
const articleTag = require('./model/articleTag.js');
const articleTagRef = require('./model/articleTagRef.js');

module.exports = app => {
  const models = {
    article,
    category,
    content,
    tag,
    articleTag,
    articleTagRef,
  };
  return models;
};
