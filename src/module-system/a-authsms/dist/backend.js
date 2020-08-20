module.exports = function(e) { const t = {}; function n(r) { if (t[r]) return t[r].exports; const o = t[r] = { i: r, l: !1, exports: {} }; return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports; } return n.m = e, n.c = t, n.d = function(e, t, r) { n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: r }); }, n.r = function(e) { typeof Symbol !== 'undefined' && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 }); }, n.t = function(e, t) { if (1 & t && (e = n(e)), 8 & t) return e; if (4 & t && typeof e === 'object' && e && e.__esModule) return e; const r = Object.create(null); if (n.r(r), Object.defineProperty(r, 'default', { enumerable: !0, value: e }), 2 & t && typeof e !== 'string') for (const o in e)n.d(r, o, function(t) { return e[t]; }.bind(null, o)); return r; }, n.n = function(e) { const t = e && e.__esModule ? function() { return e.default; } : function() { return e; }; return n.d(t, 'a', t), t; }, n.o = function(e, t) { return Object.prototype.hasOwnProperty.call(e, t); }, n.p = '', n(n.s = 1); }([ function(e, t) { e.exports = require('require3'); }, function(e, t, n) {
  const r = n(2),
    o = n(3),
    i = n(6),
    s = n(7); e.exports = function(e) {
    const t = n(8)(e),
      a = n(12)(e),
      c = n(19)(e),
      u = n(20)(e); return { routes: t, services: a, models: c, config: r, locales: o, errors: i, middlewares: s, meta: u };
  };
}, function(e, t) {
  e.exports = function(e) {
    const t = { account: { url: { mobileVerify: '/a/authsms/mobileVerify' } } },
      n = { module: 'a-authsms', name: 'captcha' }; return t.captcha = { scenes: { mobileVerify: n, signup: n, signin: n, signupCode: null } }, t.sms = { provider: { default: '' }, providers: { aliyun: { accessKeyId: '', secretAccessKey: '', endpoint: 'https://dysmsapi.aliyuncs.com', apiVersion: '2017-05-25', signName: '', templates: { mobileVerify: '', signup: '', signin: '' } } } }, t;
  };
}, function(e, t, n) { e.exports = { 'en-us': n(4), 'zh-cn': n(5) }; }, function(e, t) { e.exports = { smsProviderNonePrompt: 'Please specify the sms provider', SMSCodeInvalid: 'Verification code is invalid, please retrieve again', SMSCodeMismatch: 'Mismatch Verification Code' }; }, function(e, t) { e.exports = { SMS: '短信', smsProviderNonePrompt: '请指定SMS Provider', SMSCodeInvalid: '认证码已失效，请重新获取', SMSCodeMismatch: '认证码不匹配', 'Element Exists': '元素已存在', 'Cannot Contain __': '不能包含__', 'SMS Verification': '短信认证', 'Authentication Failed': '认证失败', 'User is Disabled': '用户被禁用' }; }, function(e, t) { e.exports = { 1001: 'smsProviderNonePrompt', 1002: 'SMSCodeInvalid', 1003: 'SMSCodeMismatch', 1004: 'Authentication Failed', 1005: 'User is Disabled' }; }, function(e, t) { e.exports = {}; }, function(e, t, n) {
  const r = n(9),
    o = n(10),
    i = n(11); e.exports = function(e) { return [{ method: 'post', path: 'version/update', controller: r, middlewares: 'inner' }, { method: 'post', path: 'version/init', controller: r, middlewares: 'inner' }, { method: 'post', path: 'version/test', controller: r, middlewares: 'test' }, { method: 'post', path: 'captcha/sendCode', controller: o, middlewares: 'captcha' }, { method: 'post', path: 'captcha/verify', controller: o, middlewares: 'inner' }, { method: 'post', path: 'auth/signin', controller: i, middlewares: 'captchaVerify', meta: { captchaVerify: { scene: { name: 'signin' } } } }, { method: 'post', path: 'auth/signup', controller: i, middlewares: 'captchaVerify,validate', meta: { captchaVerify: { scenes: [{ name: 'signupCode', dataKey: 'captchaCode', fieldKey: 'tokenCode' }, { name: 'signup', dataKey: 'captcha', fieldKey: 'token' }] }, validate: { validator: 'signup' } } }, { method: 'post', path: 'auth/mobileVerify', controller: i, middlewares: 'validate,captchaVerify', meta: { validate: { validator: 'mobileVerify' }, captchaVerify: { scene: { name: 'mobileVerify' } } } }]; };
}, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function r(e) {
    return function() {
      const t = this,
        r = arguments; return new Promise(function(o, i) { const s = e.apply(t, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  }e.exports = function(e) { class t extends e.Controller {update() { const e = this; return r(function* () { yield e.service.version.update(e.ctx.request.body), e.ctx.success(); })(); }init() { const e = this; return r(function* () { yield e.service.version.init(e.ctx.request.body), e.ctx.success(); })(); }test() { const e = this; return r(function* () { yield e.service.version.test(e.ctx.request.body), e.ctx.success(); })(); }} return t; };
}, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function r(e) {
    return function() {
      const t = this,
        r = arguments; return new Promise(function(o, i) { const s = e.apply(t, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  }e.exports = function(e) { class t extends e.Controller {sendCode() { const e = this; return r(function* () { yield e.ctx.service.captcha.sendCode({ providerInstanceId: e.ctx.request.body.providerInstanceId, context: e.ctx.request.body.context }), e.ctx.success(); })(); }verify() { const e = this; return r(function* () { const { providerInstanceId: t, context: n, data: r, dataInput: o } = e.ctx.request.body; yield e.ctx.service.captcha.verify({ providerInstanceId: t, context: n, data: r, dataInput: o }), e.ctx.success(); })(); }} return t; };
}, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function r(e) {
    return function() {
      const t = this,
        r = arguments; return new Promise(function(o, i) { const s = e.apply(t, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  }e.exports = function(e) {
    class t extends e.Controller {
      signin() {
        const e = this; return r(function* () {
          const { mobile: t, rememberMe: n } = e.ctx.request.body.data,
            r = yield e.service.auth.signin({ mobile: t, rememberMe: n }); e.ctx.success(r);
        })();
      }signup() {
        const e = this; return r(function* () {
          const { userName: t, realName: n, mobile: r } = e.ctx.request.body.data,
            o = e.ctx.request.body.state,
            i = yield e.service.auth.signup({ user: e.ctx.state.user.agent, state: o, userName: t, realName: n, mobile: r }); e.ctx.success(i);
        })();
      }mobileVerify() {
        const e = this; return r(function* () {
          const { mobile: t } = e.ctx.request.body.data,
            n = yield e.service.auth.mobileVerify({ user: e.ctx.state.user.agent, mobile: t }); e.ctx.success(n);
        })();
      }
    } return t;
  };
}, function(e, t, n) {
  const r = n(13),
    o = n(14),
    i = n(18); e.exports = function(e) { return { version: r, captcha: o, auth: i }; };
}, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function r(e) {
    return function() {
      const t = this,
        r = arguments; return new Promise(function(o, i) { const s = e.apply(t, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  }e.exports = function(e) { class t extends e.Service {update(e) { return r(function* () {})(); }init(e) { return r(function* () {})(); }test() { return r(function* () {})(); }} return t; };
}, function(e, t, n) {
  function r(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function o(e) {
    return function() {
      const t = this,
        n = arguments; return new Promise(function(o, i) { const s = e.apply(t, n); function a(e) { r(s, o, i, a, c, 'next', e); } function c(e) { r(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  } const i = n(0),
    s = i('chalk'),
    a = i('boxen'),
    c = n(15),
    u = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' }; e.exports = function(e) {
    class t extends e.Service {
      sendCode(e) {
        const t = this; return o(function* () {
          const { providerInstanceId: n, context: r } = e; const { provider: o, config: i } = t.__createSMSProvider(),
            s = yield o.sendCode({ providerInstanceId: n, context: r, config: i }); yield t.ctx.meta.captcha.update({ providerInstanceId: n, data: s, context: r });
        })();
      }verify(e) { const t = this; return o(function* () { const { providerInstanceId: n, context: r, data: o, dataInput: i } = e; const { provider: s, config: a } = t.__createSMSProvider(); yield s.verify({ providerInstanceId: n, context: r, data: o, dataInput: i, config: a }); })(); }__createSMSProvider() { let t = this.ctx.config.sms.provider.default; if (t || !e.meta.isTest && !e.meta.isLocal || (t = 'test'), !t) { const e = s.keyword('orange')(this.ctx.text('smsProviderNonePrompt')); console.log('\n' + a(e, u)), this.ctx.throw(1001); } return { provider: new (c[t](this.ctx))(), config: this.ctx.config.sms.providers[t] }; }
    } return t;
  };
}, function(e, t, n) {
  const r = n(16),
    o = n(17); e.exports = { test: r, aliyun: o };
}, function(e, t, n) {
  function r(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function o(e) {
    return function() {
      const t = this,
        n = arguments; return new Promise(function(o, i) { const s = e.apply(t, n); function a(e) { r(s, o, i, a, c, 'next', e); } function c(e) { r(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  } const i = n(0),
    s = i('chalk'),
    a = i('boxen'),
    c = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' }; e.exports = function(e) {
    return class {
      sendCode(e) {
        const t = this; return o(function* () {
          const { context: n } = e; const r = t.__prefix0(parseInt(1e4 * Math.random()), 4),
            o = s.keyword('cyan')('Test SMS Verification Code To: ') + s.keyword('yellow')(n.mobile) + s.keyword('orange')('\n' + r); return console.log('\n' + a(o, c)), { token: r };
        })();
      }verify(t) { return o(function* () { const { data: n, dataInput: r } = t; n || e.throw(1002), n.token !== r.token && e.throw(1003); })(); }__prefix0(e, t) { return (Array(t).join('0') + e).slice(-t); }
    };
  };
}, function(e, t, n) {
  function r(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function o(e) {
    return function() {
      const t = this,
        n = arguments; return new Promise(function(o, i) { const s = e.apply(t, n); function a(e) { r(s, o, i, a, c, 'next', e); } function c(e) { r(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  } const i = n(0)('@alicloud/pop-core'); e.exports = function(e) {
    return class {
      sendCode(t) {
        const n = this; return o(function* () {
          const { providerInstanceId: r, context: o, config: i } = t; const s = yield e.meta.captcha.getProviderInstance({ providerInstanceId: r }); s || e.throw(403); const a = n.__prefix0(parseInt(1e4 * Math.random()), 4),
            c = { code: a },
            u = { PhoneNumbers: o.mobile, SignName: i.signName, TemplateCode: i.templates[s.sceneName], TemplateParam: JSON.stringify(c) }; return yield n.__sendSms({ params: u, config: i }), { token: a };
        })();
      }verify(t) { return o(function* () { const { data: n, dataInput: r } = t; n || e.throw(1002), n.token !== r.token && e.throw(1003); })(); }__sendSms(e) { return o(function* () { const { params: t, config: n } = e; const r = new i.RPCClient({ accessKeyId: n.accessKeyId, secretAccessKey: n.secretAccessKey, endpoint: n.endpoint, apiVersion: n.apiVersion }); yield r.request('SendSms', t, { method: 'POST' }); })(); }__prefix0(e, t) { return (Array(t).join('0') + e).slice(-t); }
    };
  };
}, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function r(e) {
    return function() {
      const t = this,
        r = arguments; return new Promise(function(o, i) { const s = e.apply(t, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  }e.exports = function(e) {
    const t = e.meta.mockUtil.parseInfoFromPackage(__dirname); class n extends e.Service {
      signup(e) {
        const n = this; return r(function* () {
          const { user: r, state: o = 'login', userName: i, realName: s, mobile: a } = e; const c = { module: t.relativeName, provider: 'authsms', profileId: a, maxAge: 0, profile: { mobile: a, rememberMe: !1 } },
            u = yield n.ctx.meta.user.verify({ state: o, profileUser: c }); u || n.ctx.throw(403); const l = u.agent.id,
            d = { id: l }; return i && (o === 'login' || !r.userName || r.userName.indexOf('__') > -1) && (d.userName = i), s && (d.realName = s), yield n.ctx.meta.user.save({ user: d }), yield n.ctx.meta.user.setActivated({ user: { id: l, mobile: a, mobileVerified: 1 } }), yield n.ctx.login(u), u;
        })();
      }signin(e) { const t = this; return r(function* () { const { mobile: n, rememberMe: r } = e; return yield t.ctx.performAction({ method: 'post', url: 'passport/a-authsms/authsms', body: { mobile: n, rememberMe: r } }); })(); }mobileVerify(e) { const t = this; return r(function* () { const { user: n, mobile: r } = e; yield t.signup({ user: n, state: 'associate', userName: null, realName: null, mobile: r }); })(); }
    } return n;
  };
}, function(e, t) { e.exports = function(e) { return {}; }; }, function(e, t, n) {
  e.exports = function(e) {
    const t = n(21)(e),
      r = n(26)(e),
      o = n(27)(e); return { auth: t, validation: { validators: { signup: { schemas: 'signup' }, signin: { schemas: 'signin' }, mobileVerify: { schemas: 'mobileVerify' } }, keywords: { 'x-exists': r.exists }, schemas: { signup: o.signup, signin: o.signin, mobileVerify: o.mobileVerify } } };
  };
}, function(e, t, n) {
  function r(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  } function o(e) {
    return function() {
      const t = this,
        n = arguments; return new Promise(function(o, i) { const s = e.apply(t, n); function a(e) { r(s, o, i, a, c, 'next', e); } function c(e) { r(s, o, i, a, c, 'throw', e); }a(void 0); });
    };
  } const i = n(22); e.exports = function(e) {
    const t = e.meta.mockUtil.parseInfoFromPackage(__dirname),
      n = t.name; function r() { return (r = o(function* (e, r) { const { mobile: o, rememberMe: i } = r; yield e.meta.validation.validate({ validator: 'signin', data: r }); const s = yield e.meta.user.exists({ mobile: o }); return s ? s.disabled ? e.throw(1005) : { module: t.relativeName, provider: n, profileId: o, maxAge: i ? null : 0, authShouldExists: !0, profile: { mobile: o, rememberMe: i } } : e.throw(1004); })).apply(this, arguments); } return { providers: { [n]: { meta: { title: 'SMS', mode: 'direct', component: 'signin' }, config: {}, handler(e) { return { strategy: i, callback(t, n, o) { (function(e, t) { return r.apply(this, arguments); })(t.ctx, n).then(function(n) { e.passport.doVerify(t, n, o); }).catch(function(e) { o(e); }); } }; } } } };
  };
}, function(e, t, n) { const r = n(23); function o(e, t) { if (typeof e === 'function' && (t = e, e = {}), !t) throw new TypeError('LocalStrategy requires a verify callback'); r.Strategy.call(this), this.name = 'sms', this._verify = t, this._passReqToCallback = e.passReqToCallback; }n(25).inherits(o, r.Strategy), o.prototype.authenticate = function(e) { const t = this; if (e.method === 'GET') { if (e.query.state === 'associate') { let n = '/#!/a/authsms/signup?state=associate'; return e.query.returnTo && (n = ''.concat(n, '&returnTo=').concat(encodeURIComponent(e.query.returnTo))), n = e.ctx.meta.base.getAbsoluteUrl(n), t.redirect(n); } return t.error(e.ctx.parseFail(403)); } function n(n, r, o) { return n ? t.error(n) : r ? (e.ctx.success(r), void t.success(r, o)) : t.fail(o); } try { t._passReqToCallback ? this._verify(e, e.body, n) : this._verify(e.body, n); } catch (e) { return t.error(e); } }, e.exports = o; }, function(e, t, n) { const r = n(24); (e.exports = r).Strategy = r; }, function(e, t) { function n() {}n.prototype.authenticate = function(e, t) { throw new Error('Strategy#authenticate must be overridden by subclass'); }, e.exports = n; }, function(e, t) { e.exports = require('util'); }, function(e, t) {
  function n(e, t, n, r, o, i, s) {
    try {
      var a = e[i](s),
        c = a.value;
    } catch (e) { return void n(e); }a.done ? t(c) : Promise.resolve(c).then(r, o);
  }e.exports = function(e) {
    const t = {}; return t.exists = { async: !0, type: 'string', errors: !0, compile() {
      return function() {
        let t,
          r = (t = function* (t, n, r, o) {
            const i = this,
              s = yield i.meta.user.exists({ [o]: t }); if (s && s.id !== i.user.agent.id) { const t = [{ keyword: 'x-exists', params: [], message: i.text('Element Exists') }]; throw new e.meta.ajv.ValidationError(t); } if (!s && t.indexOf('__') > -1) { const t = [{ keyword: 'x-exists', params: [], message: i.text('Cannot Contain __') }]; throw new e.meta.ajv.ValidationError(t); } return !0;
          }, function() {
            const e = this,
              r = arguments; return new Promise(function(o, i) { const s = t.apply(e, r); function a(e) { n(s, o, i, a, c, 'next', e); } function c(e) { n(s, o, i, a, c, 'throw', e); }a(void 0); });
          }); return function(e, t, n, o) { return r.apply(this, arguments); };
      }();
    } }, t;
  };
}, function(e, t) { e.exports = function(e) { const t = { signup: { type: 'object', properties: { userName: { type: 'string', ebType: 'text', ebTitle: 'Username', notEmpty: !0, 'x-exists': !0 }, realName: { type: 'string', ebType: 'text', ebTitle: 'Realname', notEmpty: !0 }, mobile: { type: 'string', ebType: 'text', ebInputType: 'tel', ebTitle: 'Phone Number', notEmpty: !0, 'x-exists': !0 } } }, signin: { type: 'object', properties: { mobile: { type: 'string', ebType: 'text', ebInputType: 'tel', ebTitle: 'Phone Number', notEmpty: !0 }, rememberMe: { type: 'boolean', ebType: 'toggle', ebTitle: 'Remember Me' } } }, mobileVerify: { type: 'object', properties: { userName: { type: 'string', ebType: 'text', ebTitle: 'Username', ebReadOnly: !0 }, mobile: { type: 'string', ebType: 'text', ebInputType: 'tel', ebTitle: 'Phone Number', notEmpty: !0, 'x-exists': !0 } } } }; return t; }; } ]);
// # sourceMappingURL=backend.js.map
