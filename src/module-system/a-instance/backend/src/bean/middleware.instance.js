const require3 = require('require3');
const chalk = require3('chalk');
const boxen = require3('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // instance
      const instance = await ctx.bean.instance.get({ subdomain: ctx.subdomain });
      if (!instance) {
        // prompt
        if (ctx.app.meta.isLocal) {
          const urlInfo = ctx.locale === 'zh-cn' ? 'https://cabloy.com/zh-cn/articles/multi-instance.html' : 'https://cabloy.com/articles/multi-instance.html';
          let message = `Please add instance in ${chalk.keyword('cyan')('src/backend/config/config.local.js')}`;
          message += '\n' + chalk.keyword('orange')(`{ subdomain: '${ctx.subdomain}', password: '', title: '' }`);
          message += `\nMore info: ${chalk.keyword('cyan')(urlInfo)}`;
          console.log('\n' + boxen(message, boxenOptions));
        }
        return ctx.throw(423);
      }
      // check if disabled
      if (instance.disabled) {
        // locked
        return ctx.throw(423);
      }

      // check instance startup ready
      await ctx.bean.instance.checkAppReadyInstance();

      // try to save host/protocol to config
      if (ctxHostValid(ctx)) {
        if (!instance.config['a-base']) instance.config['a-base'] = {};
        const aBase = instance.config['a-base'];
        if (aBase.host !== ctx.host || aBase.protocol !== ctx.protocol) {
          aBase.host = ctx.host;
          aBase.protocol = ctx.protocol;
          // update
          const modelInstance = ctx.model.module(moduleInfo.relativeName).instance;
          await modelInstance.update({
            id: instance.id,
            config: JSON.stringify(instance.config) });
          // broadcast
          ctx.app.meta.broadcast.emit({
            subdomain: ctx.subdomain,
            module: 'a-instance',
            broadcastName: 'resetCache',
            data: null,
          });
        }
      }

      // ok
      ctx.instance = instance;

      // next
      await next();
    }
  }
  return Middleware;
};

function ctxHostValid(ctx) {
  return !ctx.innerAccess && ctx.host && ctx.protocol && ctx.host !== '127.0.0.1' && ctx.host !== 'localhost';
}
