const require3 = require('require3');
const util = require3('util');
const passport = require3('passport-strategy');
const OAuth = require('./oauth.js');

const __OAUTH = Symbol('WXWORK#__OAUTH');

function WxworkStrategy(options, verify) {
  options = options || {};

  if (!verify) {
    throw new TypeError('WxworkStrategy required a verify callback');
  }

  if (typeof verify !== 'function') {
    throw new TypeError('_verify must be function');
  }

  passport.Strategy.call(this, options, verify);

  this.name = options.name || 'wxwork';
  this._client = options.client || 'wxwork';
  this._verify = verify;
  this._callbackURL = options.callbackURL;
  this._lang = options.lang || 'en';
  this._state = options.state;
  this._scope = options.scope || 'snsapi_base';
  this._passReqToCallback = options.passReqToCallback;

}

util.inherits(WxworkStrategy, passport.Strategy);

WxworkStrategy.prototype.getOAuth = function(options) {
  if (this[__OAUTH] === undefined) {
    let corpid = options.corpid;
    let agentid = options.agentid;
    if (!corpid || !agentid) {
      const _config = options.getConfig();
      corpid = _config.corpid;
      agentid = _config.agentid;
    }
    this[__OAUTH] = new OAuth(corpid, agentid);
  }
  return this[__OAUTH];
};

WxworkStrategy.prototype.authenticate = function(req, options) {

  if (!req._passport) {
    return this.error(new Error('passport.initialize() middleware not in use'));
  }

  const self = this;

  options = options || {};

  // oauth
  const _oauth = this.getOAuth(options);

  // 校验完成信息
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    self.success(user, info);
  }

  // 获取code授权成功
  if (req.url.indexOf('/callback') > -1) {

    // 获取code,并校验相关参数的合法性
    // No code only state --> User has rejected send details. (Fail authentication request).
    if (req.query && req.query.state && !req.query.code) {
      return self.fail(401);
    }

    // Documentation states that if user rejects userinfo only state will be sent without code
    // In reality code equals "authdeny". Handle this case like the case above. (Fail authentication request).
    if (req.query && req.query.code === 'authdeny') {
      return self.fail(401);
    }

    const code = req.query.code;

    try {
      if (self._passReqToCallback) {
        self._verify(req, code, verified);
      } else {
        self._verify(code, verified);
      }
    } catch (ex) {
      return self.error(ex);
    }

  } else {
    const state = options.state || self._state;
    const callbackURL = options.callbackURL || self._callbackURL;
    const scope = options.scope || self._scope;

    const methodName = (this._client === 'wxwork') ? 'getAuthorizeURL' : 'getAuthorizeURLForWebsite';
    const location = _oauth[methodName](callbackURL, state, scope);

    self.redirect(location, 302);
  }
};

module.exports = WxworkStrategy;
