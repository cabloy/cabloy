const projectFrontBuild = require('./lib/project/front/build/build.js');
const projectFrontDev = require('./lib/project/front/build/dev-server.js');
const moduleFrontBuild = require('./lib/module/front/build.js');
const moduleBackendBuild = require('./lib/module/backend/build.js');

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
    front: {
      build(context) {
        moduleFrontBuild(context);
      },
    },
    backend: {
      build(context) {
        moduleBackendBuild(context);
      },
    },
  },
};
