const require3 = require('require3');
const querystring = require3('querystring');

const OAuth = function(appkey) {
  this.appkey = appkey;
};

OAuth.prototype.getAuthorizeURLForWebsite = function(redirect, state) {
  const url = 'https://oapi.dingtalk.com/connect/qrconnect';
  const info = {
    appid: this.appkey,
    response_type: 'code',
    scope: 'snsapi_login',
    state: state || '',
    redirect_uri: redirect,
  };

  return url + '?' + querystring.stringify(info);
};

module.exports = OAuth;
