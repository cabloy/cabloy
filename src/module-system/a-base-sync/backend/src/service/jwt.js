const require3 = require('require3');
const jsonwebtoken = require3('jsonwebtoken');

module.exports = app => {

  class Jwt extends app.Service {

    async create() {
      if (!this.ctx.state.jwt) ctx.throw(403);
      // token
      const token = this.ctx.state.jwt.token;
      // jwt payload
      const payload = {
        token,
        exp: Date.now() + app.config.jwt.query.maxAge, // must use exp for safety
      };
      // jwt
      const secret = app.config.jwt.secret || app.config.keys.split(',')[0];
      const jwt = jsonwebtoken.sign(payload, secret);
      return { jwt };
    }

  }

  return Jwt;
};
