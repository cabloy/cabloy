import { getProperty } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('cabloyUtils.test.ts', () => {
  it('action:getProperty', async () => {
    const user = {
      id: 1,
      name: 'tom',
      role: { name: 'admin' },
      books: [{ name: 'piao' }, { name: 'flying' }],
    };
    assert.equal(getProperty(user, 'id'), 1);
    assert.equal(getProperty(user, 'role.name'), 'admin');
    assert.equal(getProperty(user, 'role.xx'), undefined);
    assert.equal(getProperty(user, 'role.xx.yy'), undefined);
    assert.equal(getProperty(user, 'books[0].name'), 'piao');
  });
});
