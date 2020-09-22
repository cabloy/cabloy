const versionManager = require('./bean/version.manager.js');
const atomTrip = require('./bean/atom.trip.js');

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.trip': {
      mode: 'app',
      bean: atomTrip,
    },
  };
  return beans;
};
