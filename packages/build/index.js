const projectFrontBuild = require('./lib/project/front/build/build.js');
const projectFrontDev = require('./lib/project/front/build/dev-server.js');

module.exports = {
  project: {
    front: {
      build(context) {
        projectFrontBuild(context);
      },
      dev(context) {
        projectFrontDev(context);
      },
    },
  },
  module: {
    front() {},
    backend() {},
  },
};
