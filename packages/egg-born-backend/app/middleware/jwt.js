const koajwt = require('koa-jwt2');
const jsonwebtoken = require('jsonwebtoken');
const utility = require('utility');

function __checkIfJWT(ctx) {
  return !ctx.ctxCaller && (!!ctx.get('authorization') || ctx.query.hasOwnProperty('eb-jwt'));
}

function __getToken(ctx) {
  // only valid for the top ctx
  if (ctx.ctxCaller) return null;
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
      // cookies
      let cookiesJwt;
      const useJwt = __checkIfJWT(ctx);
      // set cookie
      if (useJwt) {
        // clear cookie forcely
        ctx.request.headers.cookie = '';
        if (ctx.state.jwt) {
          // check exp
          const isValid = !ctx.state.jwt.exp || ctx.state.jwt.exp > Date.now();
          if (isValid) {
            // token
            const token = ctx.state.jwt.token;
            const res = ctx.cookies.keys.decrypt(utility.base64decode(token, true, 'buffer'));
            cookiesJwt = res ? res.value.toString() : undefined;
            if (cookiesJwt) {
              // set cookie
              ctx.request.headers.cookie = cookiesJwt;
            }
          }
        }
      }
      // next
      await next();
      // check cookie
      if (useJwt && ctx.response.get('set-cookie') && ctx.response.type === 'application/json') {
        // parse
        const cookies = cookiesJwt ? __parseCookiesRequest(cookiesJwt) : {};
        const cookiesNew = __parseCookiesResponse(ctx.response.get('set-cookie'));
        // assign
        Object.assign(cookies, cookiesNew);
        // combine
        const cookiesRes = __combineCookies(cookies);
        // jwt payload
        const token = utility.base64encode(ctx.cookies.keys.encrypt(cookiesRes), true);
        const payload = { token };
        // jwt
        const jwtEncode = jsonwebtoken.sign(payload, options.secret);
        if (!ctx.response.body) ctx.response.body = {};
        ctx.response.body['eb-jwt'] = jwtEncode;
        // clear response header
        ctx.res.removeHeader('set-cookie');
      }
    });
  };
};
