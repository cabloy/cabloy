const koajwt = require('koa-jwt2');
const jsonwebtoken = require('jsonwebtoken');

function __getToken(ctx) {
  // 1. check header
  let token;
  if (ctx.get('authorization')) {
    const parts = ctx.get('authorization').split(' ');
    if (parts.length == 2) {
      const scheme = parts[0];
      const credentials = parts[1];
      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }
  }
  if (token) return token;

  // 2. check query
  token = ctx.query['eb-jwt'];
  if (token) return token;

  // not found
  return null;
}

function __splitCookie(cookie) {
  const pos = cookie.indexOf('=');
  const name = cookie.substr(0, pos);
  const value = cookie.substr(pos + 1);
  return { name, value };
}

function __parseCookiesRequest(str) {
  const cookies = {};
  const cookiesArray = (str || '').split(';')
    .map(cookie => cookie.trim())
    .filter(cookie => !!cookie);
  for (const cookie of cookiesArray) {
    const { name, value } = __splitCookie(cookie);
    cookies[name] = value;
  }
  return cookies;
}

function __parseCookiesResponse(cookiesArray) {
  const cookies = {};
  for (const cookie of cookiesArray) {
    const { name, value } = __splitCookie(cookie.split(';')[0]);
    cookies[name] = value;
  }
  return cookies;
}

function __combineCookies(cookies) {
  const cookiesArray = [];
  for (const name in cookies) {
    cookiesArray.push(`${name}=${cookies[name]}`);
  }
  return cookiesArray.join('; ');
}

module.exports = (options, app) => {
  options.secret = options.secret || app.config.keys.split(',')[0];
  options.getToken = __getToken;
  const _koajwt = koajwt(options);
  return async function jwt(ctx, next) {
    await _koajwt(ctx, async () => {
      // set cookie
      if (ctx.state.jwt) {

      }
      // next
      await next();
      // check cookie
      if (ctx.response.get('set-cookie') && ctx.get('authorization') && ctx.request.method === 'POST' && ctx.response.type === 'application/json') {
        // parse
        const cookies = __parseCookiesRequest(ctx.get('cookie'));
        const cookiesNew = __parseCookiesResponse(ctx.response.get('set-cookie'));
        // assign
        Object.assign(cookies, cookiesNew);
        // combine
        const cookiesRes = __combineCookies(cookies);
        const payload = {
          token: cookiesRes,
        };
        const jwtEncode = jsonwebtoken.sign(payload, options.secret);
        if (!ctx.response.body) ctx.response.body = {};
        ctx.response.body['eb-jwt'] = jwtEncode;
        // clear response
        ctx.res.removeHeader('set-cookie');
      }
    });
  };
};
