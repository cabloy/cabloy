const layoutAtomListPost = require('./layout/layoutAtomListPost.js');

module.exports = app => {
  const layouts = [layoutAtomListPost(app)];
  return layouts;
};
