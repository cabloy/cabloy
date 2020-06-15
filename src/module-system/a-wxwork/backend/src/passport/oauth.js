const require3 = require('require3');
const querystring = require3('querystring');

const OAuth = function(appid, agentid) {
  this.appid = appid;
  this.agentid = agentid;
};

OAuth.prototype.getAuthorizeURL = function(redirect, state, scope) {
  const url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  const info = {
    appid: this.appid,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || '',
  };

  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
};

OAuth.prototype.getAuthorizeURLForWebsite = function(redirect, state) {
  const url = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect';
  const info = {
    appid: this.appid,
    agentid: this.agentid,
    redirect_uri: redirect,
    state: state || '',
  };

  return url + '?' + querystring.stringify(info);
};

module.exports = OAuth;
