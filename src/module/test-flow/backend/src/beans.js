const versionManager = require('./bean/version.manager.js');
const atomTrip = require('./bean/atom.trip.js');
const flowActivityServiceTest = require('./bean/flow.activity.service.test.js');

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
    'flow.activity.service.test': {
      mode: 'ctx',
      bean: flowActivityServiceTest,
    },
  };
  return beans;
};
