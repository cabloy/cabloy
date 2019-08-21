const interception = require('./middleware/interception.js');
const restructuring = require('./middleware/restructuring.js');
const injection = require('./middleware/injection.js');

module.exports = {
  testInterception: interception,
  testRestructuring: restructuring,
  testInjection: injection,
};
