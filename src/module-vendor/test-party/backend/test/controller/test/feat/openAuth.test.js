const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);
const os = require('os');
const path = require('path');
const fse = require('fs-extra');

describe.only('test/controller/test/feat/openAuth.test.js', () => {
  it('action:openAuth', async () => {
    // init file
    const { config } = await _readCabloyInitFile();
    // token
    const tokenName = `clidev@${app.name}`;
    const token = config.tokens[tokenName];
    console.log(token);
    // login
    const result = await app
      .httpRequest()
      .post(mockUrl('/a/authopen/auth/signin'))
      .send({
        data: {
          clientID: token.clientID,
          clientSecret: token.clientSecret,
        },
      });
    console.log(result.body);
    assert.equal(result.body.code, 0);
  });
});

async function _readCabloyInitFile() {
  // fileName
  const fileName = path.join(os.homedir(), '.cabloy', 'openauth.json');
  // config
  const content = await fse.readFile(fileName);
  const config = JSON.parse(content);
  // ok
  return { fileName, config };
}
