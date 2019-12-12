const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/request.test.js', () => {

  it('action:request', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/request/1?age=18')).send({
      userName: 'zhennann',
    });
    assert.equal(result.body.code, 0);
  });

  it('action:requestXML', async () => {
    const xml =
`<xml>
   <return_code><![CDATA[SUCCESS]]></return_code>
   <return_msg><![CDATA[OK]]></return_msg>
</xml>
`;
    const result = await app.httpRequest().post(mockUrl('test/ctx/requestXML'))
      .type('xml')
      .send(xml);
    assert.equal(result.text, xml);
  });
});
