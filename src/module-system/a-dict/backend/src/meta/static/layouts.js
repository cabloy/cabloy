const layoutAtomListDict = require('./layout/layoutAtomListDict.js');

module.exports = app => {
  const layouts = [layoutAtomListDict(app)];
  return layouts;
};
