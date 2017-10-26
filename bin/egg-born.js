const co = require('co');
const Command = require('egg-init');

co(function* () {

  const options = {
    name: 'egg-born',
    configName: 'egg-born-init-config',
    pkgInfo: require('../package.json'),
  };

  const command = new Command(options);

  command.printUsage = function() {
    this.log(`usage:
      - cd ${this.targetDir}
      - npm install
      - npm run dev:front
      - npm run build:front
      - npm run dev:backend
      - npm run debug:backend
      - npm run lint
      - npm run test:backend
      - npm run cov:backend
      - npm run start:backend
      - npm run stop:backend
    `);
  };

  const replaceTemplate = command.replaceTemplate;
  command.replaceTemplate = function(content, scope) {
    if (content.toString('hex', 0, 4) === 'ffd8ffe0') return content;
    return replaceTemplate.call(command, content, scope);
  };

  yield command.run(process.cwd(), process.argv.slice(2));

}).catch(err => {
  console.error(err.stack);
  process.exit(1);
});
