const auth = require('./schema/auth.js');
const aliyun = require('./schema/aliyun.js');

const schemas = {};
Object.assign(schemas, auth, aliyun);
module.exports = schemas;
