const URL = require('url').URL;
const require3 = require('require3');
const koaCors = require3('@koa/cors');

const optionsDefault = {
  // origin: undefined,
  allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  // exposeHeaders: '',
  // allowHeaders: '',
  // maxAge: 0,
  credentials: true,
  // keepHeadersOnError:undefined,
};

module.exports = ctx => {
  class Middleware {
    async execute(options, next) {
      // not cors (safari not send sec-fetch-mode)
      // if (ctx.headers['sec-fetch-mode'] !== 'cors') return await next();
      if (ctx.innerAccess) return await next();

      let origin = ctx.get('origin');

      if (!origin || origin === 'null') origin = 'null';

      const host = ctx.host;
      if (origin !== 'null' && new URL(origin).host === host) {
        return await next();
      }

      // options
      const optionsCors = ctx.bean.util.extend({}, optionsDefault, options);

      // origin
      // if security plugin enabled, and origin config is not provided, will only allow safe domains support CORS.
      optionsCors.origin =
        optionsCors.origin ||
        function corsOrigin(ctx) {
          // origin is {protocol}{hostname}{port}...
          if (ctx.app.meta.util.isSafeDomain(ctx, origin)) {
            return origin;
          }
          return '';
        };

      // cors
      const fn = koaCors(optionsCors);
      await fn(ctx, next);
    }
  }
  return Middleware;
};
