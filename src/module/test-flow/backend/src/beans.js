const versionManager = require('./bean/version.manager.js');
const atomTrip = require('./bean/atom.trip.js');
const flowServiceTest = require('./bean/flow.service.test.js');

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
    // flow
    'flow.service.test': {
      mode: 'ctx',
      bean: flowServiceTest,
    },
  };
  return beans;
};
