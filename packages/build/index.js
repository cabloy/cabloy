const projectFrontBuild = require('./project/front/build/build.js');

module.exports = {
  project: {
    front(context) {
      projectFrontBuild(context);
    },
  },
  module: {
    front() {},
    backend() {},
  },
};
