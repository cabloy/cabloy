const passport = require('passport-strategy');
const util = require('util');

function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options;
    options = {};
  }
  if (!verify) {
    throw new TypeError('LocalStrategy requires a verify callback');
  }

  passport.Strategy.call(this);
  this.name = 'github-mock';
  this._verify = verify;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

Strategy.prototype.authenticate = function (req) {
  // self
  const self = this;
  const ctx = req.ctx;

  // check
  if (req.method === 'POST') {
    // not allow
    return self.error(ctx.parseFail(403));
  }

  // verified
  function verified(err, user, info) {
    if (err) {
      return self.error(err);
    }
    if (!user) {
      return self.fail(info);
    }
    ctx.success(user);
    self.success(user, info);
  }

  // mock
  const mockId = 'mock-github-user';
  const profile = {
    id: mockId,
    username: mockId,
    displayName: mockId,
  };
  const accessToken = null;
  const refreshToken = null;

  try {
    if (self._passReqToCallback) {
      this._verify(req, accessToken, refreshToken, profile, verified);
    } else {
      this._verify(accessToken, refreshToken, profile, verified);
    }
  } catch (ex) {
    return self.error(ex);
  }
};

module.exports = Strategy;
