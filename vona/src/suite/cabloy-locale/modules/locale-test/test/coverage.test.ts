import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { localesProvider as zovaJapanese } from '../../../../../../../zova/src/suite/cabloy-locale/modules/locale-jajp/src/locales/index.ts';
import { localesProvider as zovaTraditional } from '../../../../../../../zova/src/suite/cabloy-locale/modules/locale-zhtw/src/locales/index.ts';
import coreEnglish from '../../../../../../packages-vona/vona-core/src/lib/locale/en-us.ts';
import coreChinese from '../../../../../../packages-vona/vona-core/src/lib/locale/zh-cn.ts';
import { localesProvider as vonaJapanese } from '../../locale-jajp/src/locales/index.ts';
import { localesProvider as vonaTraditional } from '../../locale-zhtw/src/locales/index.ts';

const root = fileURLToPath(new URL('../../../../../../../', import.meta.url));
type Message = string | ((email: string) => string);
type Dictionary = Record<string, Message>;
type Resource = { modules?: Record<string, Dictionary> } & Record<string, unknown>;

function messageText(value: Message, label: string, key: string) {
  if (typeof value === 'string') return value;
  // This is the sole callable entry in the authored release inventory.
  assert.equal(key, 'AccountSetPasswordRecipient', `${label}: callable needs disposition`);
  assert.equal(typeof value, 'function', `${label}: unsupported message`);
  const marker = '{inventory-email}';
  const text = value(marker);
  assert.equal(typeof text, 'string', `${label}: callable must return text`);
  assert.equal(
    text.split(marker).length,
    2,
    `${label}: callable must retain its email argument once`,
  );
  return text;
}

function tokens(text: string) {
  return {
    // Positional format arguments cannot be reordered; named/indexed arguments can.
    format: text.match(/%[%sdifj]/g) ?? [],
    named: (text.match(/\{[^{}]+\}/g) ?? []).sort(),
  };
}

async function moduleRoots(directory: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'node_modules')
      continue;
    const child = path.join(directory, entry.name);
    try {
      const pkg = JSON.parse(await readFile(path.join(child, 'package.json'), 'utf8'));
      if (/^(vona|zova)-module-/.test(pkg.name ?? '')) {
        result.push(child);
        continue;
      }
    } catch (error: any) {
      if (error.code !== 'ENOENT') throw error;
    }
    result.push(...(await moduleRoots(child)));
  }
  return result;
}

async function inventory(stack: string, hash: ReturnType<typeof createHash>) {
  const targets: Record<string, Dictionary> = {};
  const exclusions: string[] = [];
  const directories = await moduleRoots(path.join(root, stack, 'src'));
  for (const directory of directories.sort()) {
    const name = path.basename(directory);
    const dictionary: Dictionary = {};
    for (const locale of ['zh-cn', 'en-us']) {
      const file = path.join(directory, 'src/config/locale', `${locale}.ts`);
      let bytes: Buffer;
      try {
        bytes = await readFile(file);
      } catch (error: any) {
        if (error.code !== 'ENOENT') throw error;
        continue;
      }
      hash.update(path.relative(root, file)).update('\0').update(bytes).update('\0');
      const source = (await import(pathToFileURL(file).href)).default;
      for (const [key, value] of Object.entries(source)) {
        messageText(value as Message, `${stack}/${name}/${locale}/${key}`, key);
        dictionary[key] = value as Message;
      }
    }
    if (Object.keys(dictionary).length) targets[name] = dictionary;
    else exclusions.push(name);
  }
  return { targets, exclusions };
}

function checkDictionary(source: Dictionary, translated: Dictionary | undefined, label: string) {
  assert.ok(translated, `${label}: missing dictionary`);
  assert.deepEqual(
    Object.keys(translated).sort(),
    Object.keys(source).sort(),
    `${label}: missing/extra keys (including plural variants)`,
  );
  for (const [key, original] of Object.entries(source)) {
    assert.equal(typeof translated[key], typeof original, `${label}/${key}: message kind`);
    const text = messageText(translated[key], `${label}/${key}`, key);
    assert.ok(text.trim(), `${label}/${key}: empty translation`);
    assert.deepEqual(
      tokens(text),
      tokens(messageText(original, `${label}/${key}/source`, key)),
      `${label}/${key}: placeholders/format tokens`,
    );
  }
}

test('both language packs cover the authored release inventory without token or plural loss', async t => {
  const hash = createHash('sha256');
  const reports: object[] = [];
  for (const [stack, packs] of [
    ['vona', [vonaJapanese, vonaTraditional]],
    ['zova', [zovaJapanese, zovaTraditional]],
  ] as const) {
    const { targets, exclusions } = await inventory(stack, hash);
    for (const pack of packs) {
      const locales = Object.keys(pack);
      assert.equal(locales.length, 1, `${stack}: helpers must not become locale IDs`);
      const locale = locales[0];
      assert.ok(locale === 'ja-jp' || locale === 'zh-tw');
      const resource = (pack as Record<string, Resource>)[locale];
      assert.deepEqual(
        Object.keys(resource.modules ?? {}).sort(),
        Object.keys(targets).sort(),
        `${stack}/${locale}: target scope parity`,
      );
      for (const [target, source] of Object.entries(targets)) {
        checkDictionary(source, resource.modules?.[target], `${stack}/${locale}/${target}`);
      }
      const { modules: _modules, ...globals } = resource;
      if (stack === 'vona') {
        checkDictionary(
          { ...coreChinese, ...coreEnglish },
          globals as Dictionary,
          `${stack}/${locale}/core`,
        );
      } else {
        assert.deepEqual(globals, {}, `${stack}/${locale}: unexpected globals`);
      }
      reports.push({
        stack,
        locale,
        targets: Object.keys(targets).length,
        keys: Object.values(targets).reduce((sum, value) => sum + Object.keys(value).length, 0),
        coreKeys: stack === 'vona' ? Object.keys({ ...coreChinese, ...coreEnglish }).length : 0,
        excludedNoAuthoredKeys: exclusions,
      });
    }
  }
  for (const file of [
    'vona/packages-vona/vona-core/src/lib/locale/en-us.ts',
    'vona/packages-vona/vona-core/src/lib/locale/zh-cn.ts',
    'vona/packages-vona/vona-core/src/lib/bean/resource/error/errorInternal.ts',
  ]) {
    hash
      .update(file)
      .update('\0')
      .update(await readFile(path.join(root, file)))
      .update('\0');
  }
  t.diagnostic(`Locale inventory: ${JSON.stringify({ sha256: hash.digest('hex'), reports })}`);
});
