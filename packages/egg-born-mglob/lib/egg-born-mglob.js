const glob = require('glob');
const semver = require('semver');
const chalk = require('chalk');
const path = require('path');
const mparse = require('egg-born-mparse').default;

module.exports = {
  glob: eggBornMglob,
};

const __paths = [
  { path: 'src/module', public: false, jsBackend: 'backend/src/main.js,dist/backend.js' },
  { path: 'src/module-system', public: false, jsBackend: 'backend/src/main.js,dist/backend.js' },
  { path: 'node_modules', public: true, jsBackend: 'dist/backend.js' },
];

function eggBornMglob() {
  // path
  const projectPath = process.cwd();

  // loop
  for (const __path of __paths) {
    const files = glob.sync(`${policy.modulesPath}*${policy.jsPath}`);
    files.forEach(file => {
      const pos1 = policy.modulesPath.length;
      const pos2 = file.indexOf('/', pos1);
      const name = file.substr(pos1, pos2 - pos1);

      if (!_public && name.indexOf('egg-born-module-') > -1) {
        throw new Error(`Should use relative name for private module: ${name}`);
      }

      const info = mparse.parseInfo(name);
      info.public = _public;
      if (!modules[info.relativeName]) {
        const pkg = util.lookupPackage(file);
        const root = path.dirname(pkg);
        modules[info.relativeName] = { root, file, name, info, pkg, package: require(pkg) };
        if (info.monkey) {
          ebModulesMonkey[info.relativeName] = modules[info.relativeName];
        }
      }
    });
  }

}
