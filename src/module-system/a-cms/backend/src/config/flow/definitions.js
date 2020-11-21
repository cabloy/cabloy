const articlePublish = require('./definition/articlePublish.js');

module.exports = app => {
  const definitions = [
    articlePublish(app),
  ];
  return definitions;
};
