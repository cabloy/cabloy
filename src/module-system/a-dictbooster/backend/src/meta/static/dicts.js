const onlineStatus = require('./dict/onlineStatus.js');
const layoutType = require('./dict/layoutType.js');
const atomStateDefault = require('./dict/atomStateDefault.js');
const atomDisabled = require('./dict/atomDisabled.js');

module.exports = app => {
  const dicts = [
    onlineStatus(app), //
    layoutType(app),
    atomStateDefault(app),
    atomDisabled(app),
  ];
  return dicts;
};
