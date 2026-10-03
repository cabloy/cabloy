import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import basic from '../cli/templates/tools/crudBasic/snippets/2-meta.index.ts';
import start from '../cli/templates/tools/crudStart/snippets/2-meta.index.ts';
import { mergeMetaIndex } from '../src/lib/mergeMetaIndex.ts';

const initial = `import { Meta } from 'vona-module-a-meta';
@Meta({ indexes: { ...$tableColumns('trainingRecord', 'studentId'), } }) class MetaIndex {}
`;

const cli = {
  template: {
    renderContent: async ({ content }: { content: string }) =>
      content.replace('<%=argv.moduleResourceName%>', 'trainingRecord'),
  },
};

describe('CRUD index snippets', () => {
  it('resolves the shared index helper from source', async () => {
    assert.equal(
      import.meta.resolve('vona-cli-set-api/mergeMetaIndex'),
      new URL('../src/lib/mergeMetaIndex.ts', import.meta.url).href,
    );
    const { mergeMetaIndex: exported } = await import('vona-cli-set-api/mergeMetaIndex');
    assert.equal(exported, mergeMetaIndex);
  });

  for (const [edition, snippet] of [
    ['basic', basic],
    ['start', start],
  ] as const) {
    it(`${edition} merges name into an existing detail index`, async () => {
      const result = await snippet.transform({ cli, ast: initial } as never);
      assert.equal(result.match(/\.\.\.\$tableColumns\('trainingRecord'/g)?.length, 1);
      assert.match(result, /\['studentId', 'name'\]/);
      assert.equal(await snippet.transform({ cli, ast: result } as never), result);
      assert.equal(mergeMetaIndex(result, 'trainingRecord', 'studentId'), result);
    });
  }
});
