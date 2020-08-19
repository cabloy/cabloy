function __adjustCookies(cookies) {
  const res = {};
  for (const item of cookies) {
    const arr = item.split(';')[0].split('=');
    res[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
  }
  return res;
}

function __combineCookies(cookies) {
  const res = [];
  for (const key in cookies) {
    res.push(`${encodeURIComponent(key)}=${encodeURIComponent(cookies[key])}`);
  }
  return res.join('; ');
}

module.exports = function(cabloy) {
  return {
    request(options) {
      // url
      if (options.url.indexOf('/') === 0) {
        options.url = `${cabloy.data.config.api.baseURL}/api${options.url}`;
      }
      // cookies
      const cookies = cabloy.data.cookies;
      if (cookies) {
        if (!options.header) options.header = {};
        options.header.cookie = __combineCookies(cookies);
      }
      // promise
      return new Promise((resolve, reject) => {
        // callback
        options.success = res => {
          // cookies
          const _cookies = res.cookies || res.headers['set-cookie'];
          if (_cookies && _cookies.length > 0) {
            cabloy.data.cookies = __adjustCookies(_cookies);
          }
          // statusCode
          const _statusCode = res.statusCode || res.status;
          if (_statusCode !== 200) {
            const error = new Error();
            error.code = _statusCode;
            return reject(error);
          }
          if (res.data.code !== 0) {
            const error = new Error();
            error.code = res.data.code;
            error.message = res.data.message;
            return reject(error);
          }
          resolve(res.data.data);
        };
        options.fail = err => {
          reject(err);
        };
        // request
        if (cabloy.data.dingtalk) {
          dd.httpRequest(options);
        } else {
          wx.request(options);
        }
      });
    },
    get(url, options) {
      options = options || {};
      options.url = url;
      options.method = 'GET';
      return this.request(options);
    },
    post(url, data, options) {
      options = options || {};
      options.url = url;
      options.method = 'POST';
      options.data = data;
      return this.request(options);
    },
  };
};
