const onlineStatus = require('./dict/onlineStatus.js');
const layoutType = require('./dict/layoutType.js');
const atomStateDefault = require('./dict/atomStateDefault.js');
const atomDisabled = require('./dict/atomDisabled.js');
const dictMode = require('./dict/dictMode.js');

const dicts = [
  onlineStatus, //
  layoutType,
  atomStateDefault,
  atomDisabled,
  dictMode,
];
module.exports = dicts;
