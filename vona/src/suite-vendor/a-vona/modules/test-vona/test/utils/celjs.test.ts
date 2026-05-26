import { cel, evaluateExpressions } from '@cabloy/utils';
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('celjs.test.ts', () => {
  it('action:celjs', async () => {
    await app.bean.executor.mockCtx(async () => {
      //
      assert.equal(
        evaluateExpressions(cel('app.config.server.workers'), { app: { ...app } }) > 0,
        true,
      );
      // map
      assert.deepEqual(evaluateExpressions(cel('{"a": 1, "b": true}')), { a: 1, b: true });
      assert.deepEqual(evaluateExpressions(cel('{"id": 1, "name": "tom"}')), {
        id: 1,
        name: 'tom',
      });
      // array
      assert.deepEqual(evaluateExpressions(cel('concat(1,[2,3],4)')), [1, 2, 3, 4]);
      assert.deepEqual(evaluateExpressions(cel('join(concat(1,[2,3],4),"_")')), '1_2_3_4');
      // string
      assert.equal(evaluateExpressions(cel('string(null)')), 'null');
      // operator: +
      assert.equal(evaluateExpressions(cel('1+"a"')), '1a');
      assert.equal(evaluateExpressions(cel('"a"+1')), 'a1');
      assert.equal(evaluateExpressions(cel('int(a)+1'), { a: 1 }), 2);
      assert.equal(evaluateExpressions(cel('"a"+null')), 'a');
      assert.equal(evaluateExpressions(cel('null+"a"')), 'a');
      assert.equal(evaluateExpressions(cel('"a"+dyn(null)')), 'a');
      assert.equal(evaluateExpressions(cel('dyn(null)+"a"')), 'a');
      // operator: ==
      assert.equal(evaluateExpressions(cel('"name"==null')), false);
      assert.equal(evaluateExpressions(cel('null=="name"')), false);
      assert.equal(evaluateExpressions(cel('1==null')), false);
      assert.equal(evaluateExpressions(cel('null==1')), false);
      assert.equal(evaluateExpressions(cel('true==null')), false);
      assert.equal(evaluateExpressions(cel('null==true')), false);
      assert.equal(evaluateExpressions(cel('false==null')), false);
      assert.equal(evaluateExpressions(cel('null==false')), false);
      // operator: !=
      assert.equal(evaluateExpressions(cel('"name"!=null')), true);
      assert.equal(evaluateExpressions(cel('null!="name"')), true);
      assert.equal(evaluateExpressions(cel('1!=null')), true);
      assert.equal(evaluateExpressions(cel('null!=1')), true);
      // optional
      assert.equal(evaluateExpressions(cel('a.?b.hasValue()'), { a: {} }), false);
      assert.equal(evaluateExpressions(cel('a.?b.value()'), { a: { b: 1 } }), 1);
      assert.strictEqual(evaluateExpressions(cel('get(a, "b.c")'), { a: { b: 1 } }), null);
      assert.equal(evaluateExpressions(cel('get(a, "b.c")'), { a: { b: { c: 1 } } }), 1);
      assert.equal(evaluateExpressions(cel('exists(a, "b.c")'), { a: { b: { c: null } } }), true);
      assert.equal(evaluateExpressions(cel('exists(a, "b.c")'), { a: { b: {} } }), false);
      assert.equal(evaluateExpressions(cel('exists(a, "b.c")'), { a: {} }), false);
      // this
      assert.deepEqual(evaluateExpressions(cel('this'), { a: 1 }), { a: 1 });
      // stringify/parse
      assert.equal(evaluateExpressions(cel('stringify(2)')), '"2"');
      assert.equal(evaluateExpressions(cel('stringify({"a": 1})')), '{\n  "a": "1"\n}');
      assert.equal(evaluateExpressions(cel('parse(\'"2"\')')), '2');
      assert.deepEqual(evaluateExpressions(cel('parse(\'{"a": 1}\')')), { a: 1 });
    });
  });
});
