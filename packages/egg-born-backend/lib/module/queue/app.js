const loadQueue = require('./queue.js');

module.exports = function(loader, modules) {

  // loadQueue
  loadQueue(loader.app);

};
