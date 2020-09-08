const projectFrontBuild = require('./project/front/build/build.js');
const projectFrontDev = require('./project/front/build/dev-server.js');

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
