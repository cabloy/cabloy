const layout = require('./model/layout.js');
const layoutContent = require('./model/layoutContent.js');
const layoutFull = require('./model/layoutFull.js');

module.exports = app => {
  const models = {
    layout,
    layoutContent,
    layoutFull,
  };
  return models;
};
