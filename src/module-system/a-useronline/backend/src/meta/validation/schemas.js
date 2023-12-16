const userOnline = require('./schema/userOnline.js');
const userOnlineHistory = require('./schema/userOnlineHistory.js');

const schemas = {};
// userOnline
Object.assign(schemas, userOnline);
// userOnlineHistory
Object.assign(schemas, userOnlineHistory);
// ok
module.exports = schemas;
