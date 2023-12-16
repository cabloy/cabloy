// static
const staticResources = require('./meta/static/resources.js');
const meta = {
  base: {
    statics: {
      'a-base.resource': {
        items: staticResources,
      },
    },
  },
};
module.exports = meta;
