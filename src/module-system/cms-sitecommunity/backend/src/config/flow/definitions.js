const postPublish = require('./definition/postPublish.js');

module.exports = app => {
  const definitions = [
    postPublish(app),
  ];
  return definitions;
};
