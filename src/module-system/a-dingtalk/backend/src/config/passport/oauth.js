const require3 = require('require3');
const querystring = require3('querystring');

const OAuth = function (appKey) {
  this.appKey = appKey;
};

OAuth.prototype.getAuthorizeURLForWebsite = function (redirect, state) {
  const url = 'https://login.dingtalk.com/oauth2/auth';
  const info = {
    client_id: this.appKey,
    response_type: 'code',
    scope: 'openid',
    state: state || '',
    redirect_uri: redirect,
  };

  return url + '?' + querystring.stringify(info);
};

module.exports = OAuth;
