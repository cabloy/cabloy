const urllib = require('urllib');

module.exports = class OpenAuthClient {
  constructor({ host }) {
    this.host = host;
    this.jwt = null;
  }

  async post({ path, body }) {
    const accessToken = (this.jwt && this.jwt.accessToken) || '';
    const httpClient = urllib.create();
    const url = `${this.host}/api${path}`;
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
};
