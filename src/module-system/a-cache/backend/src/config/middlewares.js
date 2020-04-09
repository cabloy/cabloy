const cachedb = require('./middleware/cachedb.js');
const cachemem = require('./middleware/cachemem.js');
const cacheredis = require('./middleware/cacheredis.js');

module.exports = {
  cachedb,
  cachemem,
  cacheredis,
};
