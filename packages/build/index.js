// process.traceDeprecation = true;

module.exports = {
  project: {
    front: {
      build(context) {
        const projectFrontBuild = require('./lib/project/front/build/build.js');
        projectFrontBuild(context);
      },
      dev(context) {
        const projectFrontDev = require('./lib/project/front/build/dev-server.js');
        projectFrontDev(context);
      },
    },
  },
  module: {
    front: {
      build(context) {
        const moduleFrontBuild = require('./lib/module/front/build.js');
        moduleFrontBuild(context);
      },
    },
    backend: {
      build(context) {
        const moduleBackendBuild = require('./lib/module/backend/build.js');
        moduleBackendBuild(context);
      },
    },
  },
};
