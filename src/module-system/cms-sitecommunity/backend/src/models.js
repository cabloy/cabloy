const post = require('./model/post.js');

module.exports = app => {
  const models = {
    post,
  };
  return models;
};
