const glob = require('glob');
const semver = require('semver');
const chalk = require('chalk');
const path = require('path');
const mparse = require('egg-born-mparse').default;

module.exports = {
  glob: eggBornMglob,
};

const __paths = [
  { prefix: 'src/module/', public: false, jsFront: 'front/src/main.js,dist/front.js', jsBackend: 'backend/src/main.js,dist/backend.js' },
  { prefix: 'src/module-system/', public: false, jsFront: 'front/src/main.js,dist/front.js', jsBackend: 'backend/src/main.js,dist/backend.js' },
  { prefix: 'node_modules/egg-born-module-', public: true, jsFront: 'dist/front.js', jsBackend: 'dist/backend.js' },
];

function eggBornMglob() {
  // modules
  const modules = {};
  // path
  const projectPath = process.cwd();

  // loop
  for (const __path of __paths) {
    const jsFronts = __path.jsFront.split(',');
    const jsBackends = __path.jsBackend.split(',');
    for (const index in jsFronts) {
      const jsFront = jsFronts[index];
      const jsBackend = jsBackends[index];
      const prefix = `${projectPath}/${__path.prefix}`;
      const files = glob.sync(`${prefix}*/${jsFront}`);
      for (const file of files) {
        // name
        const pos1 = prefix.length;
        const pos2 = file.indexOf('/', pos1);
        const name = file.substr(pos1, pos2 - pos1);
        if (!__path.public && name.indexOf('egg-born-module-') > -1) {
          throw new Error(`Should use relative name for private module: ${name}`);
        }
        // info
        const info = mparse.parseInfo(name);
        info.public = __path.public;
        if (!modules[info.relativeName]) {
          // more info
          const jsFrontPath = file;
          const jsBackendPath = file.substr(0, file.length - jsFront.length) + jsBackend;
          // record
          modules[info.relativeName] = { name, info, js: { front: jsFrontPath, backend: jsBackendPath } };
        }
      }
    }
  }

  // ok
  return modules;
}
