const urllib = require('urllib');
const chalk = require('chalk');
const boxen = require('boxen');

const boxenOptions = { padding: 1, margin: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' };

module.exports = class OpenAuth {
  constructor({ host }) {
    this.host = host;
    this.jwt = null;
  }

  async post({ path, body }) {
    try {
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
    } catch (err) {
      if (err.status === -1 && err.address === '127.0.0.1') {
        const message = `Run ${chalk.keyword('orange')('> npm run dev:backend <')} first!`;
        console.log('\n' + boxen(message, boxenOptions) + '\n');
      }
      throw err;
    }
  }
};
