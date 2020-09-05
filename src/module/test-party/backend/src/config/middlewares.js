const interception = require('./middleware/interception.js');
const restructuring = require('./middleware/restructuring.js');

module.exports = {
  testInterception: interception,
  testRestructuring: restructuring,
};
