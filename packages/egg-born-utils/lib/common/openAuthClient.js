const urllib = require('urllib');
const tools = require('./tools.js');

module.exports = class OpenAuthClient {
  constructor({ token }) {
    this.token = token;
    this.jwt = null;
    this.signinRes = null;
    this.locale = null;
  }

  async post({ path, body }) {
    const accessToken = (this.jwt && this.jwt.accessToken) || '';
    const httpClient = urllib.create();
    const url = `${this.token.host}/api${path}`;
    const options = {
      method: 'POST',
      data: body,
      contentType: 'json',
      dataType: 'json',
      followRedirect: true,
      maxRedirects: 5,
      timeout: 20000,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    if (this.locale) {
      options.headers.Cookie = `locale=${this.locale};`;
    }
    const res = await httpClient.request(url, options);
    // error
    if (res.data.code !== 0) {
      throw new Error(res.data.message);
    }
    // jwt
    const jwt = res.data['eb-jwt-oauth'];
    if (jwt) {
      this.jwt = jwt;
    }
    // ok
    return res.data.data;
  }

  async signin() {
    // signin
    const res = await this.post({
      path: '/a/authopen/auth/signin',
      body: {
        data: {
          clientID: this.token.clientID,
          clientSecret: this.token.clientSecret,
        },
      },
    });
    // locale
    let locale = res.user.agent.locale;
    if (!locale) {
      locale = tools.preferredLocale({ locale: null, locales: res.locales });
    }
    // ok
    this.signinRes = res;
    this.locale = locale;
  }

  async logout() {
    // logout
    await this.post({
      path: '/a/base/auth/logout',
    });
  }
};
