const utils = require('./utils.js');

// copy modules
utils.copyModules().then(() => {
  require('./dev-server2.js');
});
