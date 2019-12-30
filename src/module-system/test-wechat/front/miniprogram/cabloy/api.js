module.exports = function(cabloy) {
  return {
    request(options) {
      // url
      if (options.url.indexOf('/') === 0) {
        options.url = `${cabloy.data.config.api.baseURL}/api${options.url}`;
      }
      // cookie
      const cookie = cabloy.data.cookie;
      if (cookie) {
        if (!options.header) options.header = {};
        options.header.Cookie = cookie;
      }
      // promise
      return new Promise((resolve, reject) => {
        // callback
        options.success = res => {
          // cookie
          const cookie = res.header && res.header['Set-Cookie'];
          if (cookie) {
            cabloy.data.cookie = cookie;
          }
          if (res.statusCode !== 200) {
            const error = new Error();
            error.code = res.statusCode;
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
        wx.request(options);
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
