const article = require('./atomClass/article.js');

module.exports = app => {
  const atomClasses = {
    //
    article: article(app),
  };
  return atomClasses;
};
