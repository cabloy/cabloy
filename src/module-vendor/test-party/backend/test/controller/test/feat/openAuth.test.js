const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);
const eggBornUtils = require('egg-born-utils');

describe('test/controller/test/feat/openAuth.test.js', () => {
  const __atomClassParty = {
    module: 'test-party',
    atomClassName: 'party',
  };

  it('action:openAuth:resource', async () => {
    // init file
    const { config } = await eggBornUtils.readOpenAuthConfig();
    // token
    const tokenName = `clidev@${app.name}`;
    const token = config.tokens[tokenName];
    // login
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/authopen/auth/signin'))
      .set('Authorization', 'Bearer ')
      .send({
        data: {
          clientID: token.clientID,
          clientSecret: token.clientSecret,
        },
      });
    assert.equal(result.body.code, 0);
    // accessToken
    const accessToken = result.body['eb-jwt-oauth'].accessToken;
    assert.equal(!!accessToken, true);
    // echo
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/auth/echo'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data.user.op.userName, 'root');
    // resourceCheckSuccess
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/test/feat/openAuth/resourceCheckSuccess'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    assert.equal(result.body.code, 0);
    // resourceCheckFail
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/test/feat/openAuth/resourceCheckFail'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    assert.equal(result.status, 403);
    // logout
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/auth/logout'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    assert.equal(result.body.code, 0);
  });

  it('action:openAuth:atom', async () => {
    // init file
    const { config } = await eggBornUtils.readOpenAuthConfig();
    // token
    const tokenName = `clidev@${app.name}`;
    const token = config.tokens[tokenName];
    // login
    let result = await app
      .httpRequest()
      .post(mockUrl('/a/authopen/auth/signin'))
      .set('Authorization', 'Bearer ')
      .send({
        data: {
          clientID: token.clientID,
          clientSecret: token.clientSecret,
        },
      });
    assert.equal(result.body.code, 0);
    // accessToken
    const accessToken = result.body['eb-jwt-oauth'].accessToken;
    assert.equal(!!accessToken, true);
    // create check
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/test/atom/checkRightCreate'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        atomClass: __atomClassParty,
      });
    assert.equal(result.body.code, 0);
    // create
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/create'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        atomClass: __atomClassParty,
      });
    const partyKeyDraft = result.body.data;
    // read
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/test/atom/checkRightRead'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        key: partyKeyDraft,
      });
    assert.equal(result.body.code, 0);
    // party/overBulk
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/party/overBulk'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        keys: [],
      });
    assert.equal(result.body.code, 0);
    // write
    result = await app
      .httpRequest()
      .post(mockUrl('/test/party/test/atom/checkRightWrite'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        key: partyKeyDraft,
      });
    assert.equal(result.body.code, 0);
    // delete
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/atom/delete'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        key: partyKeyDraft,
      });
    assert.equal(result.body.code, 0);
    // logout
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/auth/logout'))
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    assert.equal(result.body.code, 0);
  });
});
