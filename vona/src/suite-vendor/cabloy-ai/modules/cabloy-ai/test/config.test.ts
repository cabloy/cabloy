import type { TableIdentity } from 'table-identity';
import type { VonaApplication } from 'vona';

import { generateText, streamText } from 'ai';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { describe, it } from 'node:test';
import { deepExtend, runWithZodQueryCoercion } from 'vona';
import { app } from 'vona-mock';

import type { IAiSceneRecord } from '../src/types/aiScene.ts';

import { testApiKey } from '../src/config/config.test.ts';
import { config as createConfig } from '../src/config/config.ts';
import { assertAiDatabaseDocument } from '../src/lib/configuration.ts';
import { AiInvocation } from '../src/lib/invocation.ts';

// Scene-row mutations are confined to shareTest, never the HTTP/E2E default instance.
describe('cabloy-ai configuration and facade', { concurrency: false }, () => {
  it('keeps unset environment fields sparse so base connection and model values can inherit', () => {
    const makeConfig = (env: Record<string, string | undefined>, isTest = false) =>
      createConfig({ meta: { env, isTest } } as unknown as VonaApplication);
    for (const empty of [undefined, '']) {
      const config = makeConfig({
        AI_PROVIDER_DEFAULT_FACTORY: empty,
        AI_PROVIDER_DEFAULT_BASEURL: empty,
        AI_PROVIDER_DEFAULT_APIKEY: empty,
        AI_MODEL_DEFAULT_MODELID: empty,
      });
      const providerBase = {
        factory: 'openai',
        options: { baseURL: 'https://fixture.invalid/v1', apiKey: 'base-fixture-only-key' },
      };
      assert.deepEqual(deepExtend({}, providerBase, config.aiProviders.default), providerBase);
      assert.deepEqual(deepExtend({}, { modelId: 'base-model' }, config.aiModels.default), {
        provider: 'default',
        modelId: 'base-model',
      });
      assert.equal(config.base?.aiProviders?.options?.headers?.['accept-encoding'], 'identity');
      assert.equal(config.base?.aiModels?.request?.maxRetries, 0);
    }
    const env = {
      AI_PROVIDER_DEFAULT_FACTORY: 'openaiCompatible',
      AI_PROVIDER_DEFAULT_BASEURL: 'https://named.invalid/v1',
      AI_PROVIDER_DEFAULT_APIKEY: 'named-fixture-only-key',
      AI_MODEL_DEFAULT_PROVIDER: 'alternate',
      AI_MODEL_DEFAULT_MODELID: 'named-model',
    };
    const configured = makeConfig(env);
    assert.deepEqual(configured.aiProviders.default, {
      factory: 'openaiCompatible',
      options: { baseURL: env.AI_PROVIDER_DEFAULT_BASEURL, apiKey: env.AI_PROVIDER_DEFAULT_APIKEY },
    });
    assert.deepEqual(configured.aiModels.default, {
      provider: 'alternate',
      modelId: 'named-model',
    });
    const mocked = makeConfig(env, true);
    assert.equal(mocked.aiProviders.default.factory, 'test');
    assert.equal(mocked.aiProviders.default.options?.apiKey, testApiKey);
    assert.equal(mocked.aiModels.default.modelId, 'test-model');
  });

  it('resolves config only without materializing rows, preserving SDK result shapes', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('cabloy-ai');
      const before = await Promise.all([
        scope.model.aiProvider.count(),
        scope.model.aiModel.count(),
        scope.model.aiScene.count(),
      ]);
      const provider = await scope.service.configuration.resolveProvider('default');
      const model = await scope.service.configuration.resolveModel('default');
      assert.equal(provider.options?.headers?.['accept-encoding'], 'identity');
      assert.equal(provider.enabled, true);
      assert.equal(model.request?.maxRetries, 0);
      assert.equal(model.enabled, true);
      const bound = await app.bean.ai.create();
      assert.deepEqual(bound.identity, {
        aiScene: 'cabloy-ai:default',
        aiProvider: 'default',
        aiModel: 'default',
        modelId: 'test-model',
      });
      const result = await bound.generateText({ prompt: 'config only' });
      assert.equal(result.text, 'AI test response: config only');
      assert.equal(result.providerMetadata?.test?.apiKey, testApiKey);
      assert.equal(result.usage.inputTokens, 3);
      const stream = bound.streamText({ prompt: 'stream sync' });
      assert.equal('then' in stream, false);
      assert.ok(stream.stream);
      assert.equal(await stream.text, 'AI test response: stream sync');
      assert.equal((await stream.providerMetadata)?.test?.apiKey, testApiKey);
      assert.deepEqual(
        await Promise.all([
          scope.model.aiProvider.count(),
          scope.model.aiModel.count(),
          scope.model.aiScene.count(),
        ]),
        before,
      );
      assert.equal(JSON.stringify(bound).includes('apiKey'), false);
      assert.equal(JSON.stringify(bound).includes(testApiKey), false);
    });
  });

  it('merges base, named and stored definitions without registering unknown aliases or mutating defaults', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const name = `base-${randomUUID()}`;
        const storedName = `stored-${randomUUID()}`;
        Object.defineProperty(app.ctx, 'config', {
          configurable: true,
          value: deepExtend({}, app.ctx.config, {
            modules: {
              'cabloy-ai': {
                base: {
                  aiProviders: {
                    factory: 'test',
                    options: { apiKey: 'base-fixture-key', headers: { accept: 'base' } },
                  },
                  aiModels: {
                    provider: name,
                    modelId: 'base-model',
                    generation: { temperature: 0.5, stopSequences: ['base'] },
                    request: { maxRetries: 2 },
                  },
                },
                aiProviders: {
                  [name]: { options: { headers: { accept: 'named' } } },
                },
                aiModels: {
                  [name]: { generation: { temperature: 0, stopSequences: ['named'] } },
                },
              },
            },
          }),
        });
        const scope = app.scope('cabloy-ai');
        const configuration = scope.service.configuration;
        const before = deepExtend({}, scope.config);
        let providerId: TableIdentity | undefined;
        let modelId: TableIdentity | undefined;
        let storedProviderId: TableIdentity | undefined;
        let storedModelId: TableIdentity | undefined;
        try {
          const provider = await configuration.resolveProvider(name);
          assert.equal(provider.factory, 'test');
          assert.deepEqual(provider.options?.headers, {
            'accept-encoding': 'identity',
            'accept': 'named',
          });
          const namedModel = await configuration.resolveModel(name);
          assert.equal(namedModel.modelId, 'base-model');
          assert.equal(namedModel.generation?.temperature, 0);
          assert.deepEqual(namedModel.generation?.stopSequences, ['named']);
          assert.equal(namedModel.request?.maxRetries, 2);
          const original = await app.bean.ai.create('cabloy-ai:default', { aiModel: name });
          providerId = (
            await configuration.saveProvider(name, {
              options: { apiKey: 'stored-fixture-key', headers: { accept: 'stored' } },
            })
          ).id;
          modelId = (
            await configuration.saveModel(name, {
              generation: { stopSequences: ['stored'] },
              request: { maxRetries: 0 },
            })
          ).id;
          const stored = await configuration.resolveProvider(name);
          assert.deepEqual(stored.options?.headers, {
            'accept-encoding': 'identity',
            'accept': 'stored',
          });
          assert.equal((await configuration.resolveModel(name)).request?.maxRetries, 0);
          assert.deepEqual((await configuration.resolveModel(name)).generation?.stopSequences, [
            'stored',
          ]);
          const updated = await app.bean.ai.create('cabloy-ai:default', { aiModel: name });
          assert.equal(
            (await original.generateText({ prompt: 'snapshot' })).providerMetadata?.test?.apiKey,
            'base-fixture-key',
          );
          assert.equal(
            (await updated.generateText({ prompt: 'snapshot' })).providerMetadata?.test?.apiKey,
            'stored-fixture-key',
          );
          await configuration.saveProvider(name, {});
          await configuration.saveModel(name, {});
          assert.deepEqual((await scope.model.aiProvider.get({ name }))?.overrides, {});
          assert.deepEqual((await scope.model.aiModel.get({ name }))?.overrides, {});
          assert.equal(
            (await configuration.resolveProvider(name)).options?.apiKey,
            'base-fixture-key',
          );
          assert.equal((await configuration.resolveModel(name)).request?.maxRetries, 2);
          storedProviderId = (await configuration.saveProvider(storedName, {})).id;
          storedModelId = (await configuration.saveModel(storedName, { provider: storedName })).id;
          assert.equal(
            (await configuration.resolveProvider(storedName)).options?.headers?.['accept-encoding'],
            'identity',
          );
          assert.equal((await configuration.resolveModel(storedName)).modelId, 'base-model');
          assert.equal((await configuration.resolveModel(storedName)).request?.maxRetries, 2);
          await assert.rejects(
            () => configuration.resolveProvider(`unknown-${name}`),
            /AI_PROVIDER_FACTORY_NOT_REGISTERED/,
          );
          await assert.rejects(
            () => configuration.resolveModel(`unknown-${name}`),
            /AI_MODEL_INCOMPLETE/,
          );
          await configuration.saveProvider(storedName, { enabled: false });
          await assert.rejects(
            () => configuration.resolveProvider(storedName),
            /AI_PROVIDER_DISABLED/,
          );
          await app.bean.executor.mockCtx(
            async () => {
              await assert.rejects(
                () => app.scope('cabloy-ai').service.configuration.resolveProvider(storedName),
                /AI_PROVIDER_FACTORY_NOT_REGISTERED/,
              );
            },
            { instanceName: '' },
          );
          assert.deepEqual(scope.config, before);
        } finally {
          if (storedModelId) await scope.model.aiModel.delete({ id: storedModelId });
          if (modelId) await scope.model.aiModel.delete({ id: modelId });
          if (storedProviderId) await scope.model.aiProvider.delete({ id: storedProviderId });
          if (providerId) await scope.model.aiProvider.delete({ id: providerId });
        }
      },
      { instanceName: 'shareTest' as never },
    );
  });

  it('uses registered openaiCompatible chat generation and streaming with optional credentials', async () => {
    await app.bean.executor.mockCtx(async () => {
      const factory = app.scope('cabloy-ai').config.providerFactories.openaiCompatible;
      const calls: { url: string; headers: Headers; body: Record<string, unknown> }[] = [];
      const fetch: typeof globalThis.fetch = async (url, init) => {
        const body = JSON.parse(String(init?.body)) as Record<string, unknown>;
        calls.push({ url: String(url), headers: new Headers(init?.headers), body });
        const usage = { prompt_tokens: 3, completion_tokens: 4, total_tokens: 7 };
        if (body.stream) {
          const chunks = [
            {
              choices: [{ index: 0, delta: { role: 'assistant', content: 'Compatible response' } }],
            },
            { choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage },
          ];
          return new Response(
            `${chunks.map(chunk => `data: ${JSON.stringify(chunk)}\n\n`).join('')}data: [DONE]\n\n`,
            { headers: { 'content-type': 'text/event-stream' } },
          );
        }
        return Response.json({
          choices: [
            {
              message: { role: 'assistant', content: 'Compatible response' },
              finish_reason: 'stop',
            },
          ],
          usage,
        });
      };
      for (const apiKey of ['cabloy-ai-test-only-compatible-key', undefined]) {
        const model = factory({
          baseURL: 'https://compatible.invalid/v1/',
          apiKey,
          name: 'must-not-change-the-namespace',
          includeUsage: true,
          fetch,
        }).languageModel('compatible-model');
        const options = {
          model,
          prompt: 'compatible request',
          maxRetries: 0,
          providerOptions: { openaiCompatible: { fixture_option: 'forwarded' } },
        };
        const result = await generateText(options);
        assert.equal(result.text, 'Compatible response');
        assert.equal(result.usage.inputTokens, 3);
        const stream = streamText(options);
        assert.equal(await stream.text, 'Compatible response');
        assert.equal((await stream.usage).outputTokens, 4);
        const pair = calls.splice(0);
        assert.equal(pair.length, 2);
        for (const call of pair) {
          assert.equal(call.url, 'https://compatible.invalid/v1/chat/completions');
          assert.equal(call.headers.get('authorization'), apiKey ? `Bearer ${apiKey}` : null);
          assert.equal(call.body.model, 'compatible-model');
          assert.equal(call.body.fixture_option, 'forwarded');
          assert.deepEqual(call.body.messages, [{ role: 'user', content: 'compatible request' }]);
        }
        assert.equal(pair[0].body.stream, undefined);
        assert.equal(pair[1].body.stream, true);
        assert.deepEqual(pair[1].body.stream_options, { include_usage: true });
      }
    });
  });

  it('forwards resolved base encoding headers and preserves strict Responses streaming validation', async () => {
    await app.bean.executor.mockCtx(async () => {
      const scope = app.scope('cabloy-ai');
      const factory = scope.config.providerFactories.openai;
      const provider = await scope.service.configuration.resolveProvider('default');
      const configuredHeaders = provider.options?.headers;
      assert.ok(configuredHeaders);
      assert.equal(configuredHeaders['accept-encoding'], 'identity');
      const headers = { 'accept-encoding': configuredHeaders['accept-encoding'] };
      const requestHeaders: Headers[] = [];
      const events = [
        {
          type: 'response.created',
          response: { id: 'resp_fixture', created_at: 1, model: 'fixture-model' },
        },
        {
          type: 'response.output_item.added',
          output_index: 0,
          item: { type: 'message', id: 'msg_fixture' },
        },
        { type: 'response.output_text.delta', item_id: 'msg_fixture', delta: '' },
        { type: 'response.output_text.delta', item_id: 'msg_fixture', delta: 'OK' },
        {
          type: 'response.output_item.done',
          output_index: 0,
          item: { type: 'message', id: 'msg_fixture' },
        },
        {
          type: 'response.completed',
          response: { incomplete_details: null, usage: { input_tokens: 1, output_tokens: 1 } },
        },
      ];
      const fetch: typeof globalThis.fetch = async (_input, init) => {
        requestHeaders.push(new Headers(init?.headers));
        return new Response(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join(''), {
          headers: { 'content-type': 'text/event-stream' },
        });
      };
      for (const coercion of [true, false]) {
        await runWithZodQueryCoercion(coercion, async () => {
          const result = streamText({
            model: factory({ apiKey: 'fixture-only-key', headers, fetch }).languageModel(
              'fixture-model',
            ),
            prompt: 'fixture',
            maxRetries: 0,
            onError: () => {},
          });
          let failed = false;
          for await (const part of result.stream) {
            if (part.type === 'error') failed = true;
          }
          assert.equal(failed, coercion);
          if (!coercion) {
            assert.equal(await result.text, 'OK');
            assert.equal(await result.finishReason, 'stop');
          }
        });
      }
      // The facade must retain its synchronous SDK result while provider work stays strict.
      await runWithZodQueryCoercion(true, async () => {
        const bound = new AiInvocation(
          factory({ apiKey: 'fixture-only-key', headers, fetch }).languageModel('fixture-model'),
          {
            aiScene: 'cabloy-ai:default',
            aiProvider: 'fixture',
            aiModel: 'fixture',
            modelId: 'fixture-model',
          },
          { maxRetries: 0 },
          { maxInputCharacters: 1024, maxOutputTokens: 64, timeoutMs: 1000 },
        );
        const result = bound.streamText({ prompt: 'fixture' });
        assert.equal('then' in result, false);
        for await (const part of result.stream) assert.notEqual(part.type, 'error');
        assert.equal(await result.text, 'OK');
        assert.equal(await result.finishReason, 'stop');
        // A trusted per-call policy overrides the provider's shared header.
        const overridden = bound.streamText({
          prompt: 'fixture',
          headers: { 'accept-encoding': 'gzip' },
        });
        assert.equal(await overridden.text, 'OK');
      });
      // Direct SDK factories bypass Cabloy configuration resolution, including base.
      await runWithZodQueryCoercion(false, async () => {
        const independent = streamText({
          model: factory({ apiKey: 'fixture-only-key', fetch }).languageModel('fixture-model'),
          prompt: 'fixture',
          maxRetries: 0,
        });
        assert.equal(await independent.text, 'OK');
      });
      assert.deepEqual(
        requestHeaders.map(item => item.get('accept-encoding')),
        ['identity', 'identity', 'identity', 'gzip', null],
      );
    });
  });

  it('requires an explicit compatible baseURL and keeps facade factory errors safe', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scope = app.scope('cabloy-ai');
        const name = `compatible-${randomUUID()}`;
        let providerId: TableIdentity | undefined;
        let modelId: TableIdentity | undefined;
        try {
          for (const baseURL of [undefined, '', '   ']) {
            assert.throws(() => scope.config.providerFactories.openaiCompatible({ baseURL }), {
              message: 'AI_OPENAI_COMPATIBLE_BASE_URL_REQUIRED',
            });
          }
          providerId = (
            await scope.service.configuration.saveProvider(name, {
              factory: 'openaiCompatible',
              options: { apiKey: 'cabloy-ai-test-only-compatible-key' },
            })
          ).id;
          modelId = (
            await scope.service.configuration.saveModel(name, {
              provider: name,
              modelId: 'compatible-model',
            })
          ).id;
          await assert.rejects(() => app.bean.ai.create('cabloy-ai:default', { aiModel: name }), {
            message: 'AI_FACTORY_FAILED',
          });
        } finally {
          if (modelId) await scope.model.aiModel.delete({ id: modelId });
          if (providerId) await scope.model.aiProvider.delete({ id: providerId });
        }
      },
      { instanceName: 'shareTest' as never },
    );
  });

  it('replaces sparse overrides, refreshes snapshots, uses selected model defaults, and isolates instances', async () => {
    const name = `test-${randomUUID()}`;
    let modelId: TableIdentity | undefined;
    let providerId: TableIdentity | undefined;
    let sceneId: TableIdentity | undefined;
    await app.bean.executor.mockCtx(
      async () => {
        const scope = app.scope('cabloy-ai');
        const configuration = scope.service.configuration;
        try {
          providerId = (
            await configuration.saveProvider(name, {
              factory: 'test',
              enabled: true,
              options: {
                apiKey: 'cabloy-ai-test-only-database-key-92bf',
                headers: { accept: 'application/json' },
              },
            })
          ).id;
          assert.equal(
            (await scope.model.aiProvider.get({ name }))?.overrides?.options?.apiKey,
            'cabloy-ai-test-only-database-key-92bf',
          );
          assert.equal(
            (await configuration.resolveProvider(name)).options?.apiKey,
            'cabloy-ai-test-only-database-key-92bf',
          );
          modelId = (
            await configuration.saveModel(name, {
              provider: name,
              modelId: 'alternate-test-model',
              generation: { temperature: 0, stopSequences: ['first', 'second'] },
              request: { maxRetries: 0 },
            })
          ).id;
          const original = await app.bean.ai.create();
          sceneId = (
            await configuration.saveScene('cabloy-ai:default', {
              aiModel: name,
              generation: { stopSequences: ['replacement'] },
              limits: { maxOutputTokens: 100 },
            })
          ).id;
          const bound = await app.bean.ai.create();
          const calls: {
            temperature?: number;
            maxOutputTokens?: number;
            stopSequences?: string[];
          }[] = [];
          const result = await bound.generateText({
            prompt: 'defaults',
            onLanguageModelCallStart: event => {
              calls.push(event);
            },
          });
          assert.equal(
            result.providerMetadata?.test?.apiKey,
            'cabloy-ai-test-only-database-key-92bf',
          );
          assert.equal(calls[0].temperature, 0);
          assert.equal(calls[0].maxOutputTokens, 100);
          assert.deepEqual(calls[0].stopSequences, ['replacement']);
          assert.equal(original.identity.aiModel, 'default');
          assert.equal(bound.identity.aiModel, name);
          assert.equal(
            JSON.stringify(bound).includes('cabloy-ai-test-only-database-key-92bf'),
            false,
          );
          assert.equal(bound.identity.modelId, 'alternate-test-model');
          assert.equal(bound.limits.maxOutputTokens, 100);
          assert.deepEqual(
            (await configuration.resolveScene('cabloy-ai:default')).generation?.stopSequences,
            ['replacement'],
          );
          assert.equal((await configuration.resolveModel(name)).generation?.temperature, 0);
          assert.equal((await configuration.resolveModel(name)).request?.maxRetries, 0);
          const overridden = await app.bean.ai.create('cabloy-ai:default', { aiModel: 'default' });
          assert.equal(overridden.identity.modelId, 'test-model');
          assert.equal(
            (await bound.generateText({ prompt: 'still works' })).text,
            'AI test response: still works',
          );
          await configuration.saveScene('cabloy-ai:default', {});
          assert.equal((await app.bean.ai.create()).identity.aiModel, 'default');
          assert.equal(bound.identity.aiModel, name);
          await configuration.saveModel(name, {
            provider: name,
            modelId: 'new-model-id',
            enabled: false,
          });
          assert.equal((await scope.model.aiModel.get({ name }))?.overrides?.generation, undefined);
          await assert.rejects(() => configuration.resolveModel(name), /AI_MODEL_DISABLED/);
          // A different active instance cannot observe these provider/model additions.
          await app.bean.executor.mockCtx(
            async () => {
              assert.equal(await app.scope('cabloy-ai').model.aiProvider.get({ name }), undefined);
              await assert.rejects(
                () => app.scope('cabloy-ai').service.configuration.resolveModel(name),
                /AI_MODEL_INCOMPLETE/,
              );
            },
            { instanceName: '' },
          );
        } finally {
          if (sceneId) await scope.model.aiScene.delete({ id: sceneId });
          if (modelId) await scope.model.aiModel.delete({ id: modelId });
          if (providerId) await scope.model.aiProvider.delete({ id: providerId });
        }
      },
      { instanceName: 'shareTest' as never },
    );
  });

  it('inherits config credentials, rotates and resets sparse provider overrides without changing bound snapshots', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scope = app.scope('cabloy-ai');
        const configuration = scope.service.configuration;
        let providerId: TableIdentity | undefined;
        try {
          const original = await app.bean.ai.create();
          providerId = (
            await configuration.saveProvider('default', {
              options: { apiKey: 'cabloy-ai-test-only-rotated-key-0e61' },
            })
          ).id;
          assert.equal((await configuration.resolveProvider('default')).factory, 'test');
          const rotated = await app.bean.ai.create();
          assert.equal(
            (await rotated.generateText({ prompt: 'rotated' })).providerMetadata?.test?.apiKey,
            'cabloy-ai-test-only-rotated-key-0e61',
          );
          await configuration.saveProvider('default', {});
          assert.deepEqual((await scope.model.aiProvider.get({ name: 'default' }))?.overrides, {});
          assert.equal(
            (await configuration.resolveProvider('default')).options?.apiKey,
            testApiKey,
          );
          assert.equal(scope.config.aiProviders.default.options?.apiKey, testApiKey);
          assert.equal(
            (await (await app.bean.ai.create()).generateText({ prompt: 'reset' })).providerMetadata
              ?.test?.apiKey,
            testApiKey,
          );
          assert.equal(
            (await original.generateText({ prompt: 'original snapshot' })).providerMetadata?.test
              ?.apiKey,
            testApiKey,
          );
          assert.equal(
            (await rotated.generateText({ prompt: 'rotated snapshot' })).providerMetadata?.test
              ?.apiKey,
            'cabloy-ai-test-only-rotated-key-0e61',
          );
          assert.equal(
            JSON.stringify(rotated).includes('cabloy-ai-test-only-rotated-key-0e61'),
            false,
          );
          await app.bean.executor.mockCtx(
            async () => {
              const other = app.scope('cabloy-ai');
              assert.equal(await other.model.aiProvider.get({ name: 'default' }), undefined);
              assert.equal(
                (await other.service.configuration.resolveProvider('default')).options?.apiKey,
                testApiKey,
              );
            },
            { instanceName: '' },
          );
        } finally {
          if (providerId) await scope.model.aiProvider.delete({ id: providerId });
        }
      },
      { instanceName: 'shareTest' as never },
    );
  });

  it('permits only exact provider options.apiKey while retaining JSON, header and URL guards', () => {
    assert.doesNotThrow(() =>
      assertAiDatabaseDocument({ options: { apiKey: 'dummy' } }, 'provider'),
    );
    assert.throws(
      () => assertAiDatabaseDocument({ options: { apiKey: 'dummy' } }),
      /AI_DATABASE_SECRET_FORBIDDEN/,
    );
    for (const document of [
      { apiKey: 'dummy' },
      { options: { api_key: 'dummy' } },
      { options: { APIKey: 'dummy' } },
      { Options: { apiKey: 'dummy' } },
      { options: { nested: { apiKey: 'dummy' } } },
      { nested: { options: { apiKey: 'dummy' } } },
      { options: { headers: { apiKey: 'dummy' } } },
      { options: { password: 'dummy' } },
    ]) {
      assert.throws(
        () => assertAiDatabaseDocument(document, 'provider'),
        /AI_DATABASE_SECRET_FORBIDDEN/,
      );
    }
    assert.throws(() => assertAiDatabaseDocument({ options: { fetch: () => {} } }, 'provider'));
    assert.throws(
      () => assertAiDatabaseDocument({ options: { headers: { 'x-custom': 'dummy' } } }, 'provider'),
      /AI_DATABASE_SECRET_HEADER_FORBIDDEN/,
    );
    for (const baseURL of [
      'https://user:dummy@example.com',
      'https://example.com?key=dummy',
      'https://example.com#dummy',
    ]) {
      assert.throws(
        () => assertAiDatabaseDocument({ options: { baseURL } }, 'provider'),
        /AI_DATABASE_SECRET_URL_FORBIDDEN/,
      );
    }
  });

  it('rejects unregistered executable configuration, misplaced credentials and disabled admission', async () => {
    await app.bean.executor.mockCtx(
      async () => {
        const scope = app.scope('cabloy-ai');
        const configuration = scope.service.configuration;
        const name = `invalid-${randomUUID()}`;
        let providerId: TableIdentity | undefined;
        let sceneId: TableIdentity | undefined;
        try {
          await assert.rejects(
            () => configuration.saveProvider(name, { factory: 'unknown' }),
            /AI_PROVIDER_FACTORY_NOT_REGISTERED/,
          );
          await assert.rejects(
            () =>
              configuration.saveProvider(name, {
                factory: 'test',
                options: { nested: { apiKey: 'plaintext' } },
              }),
            /AI_DATABASE_SECRET_FORBIDDEN/,
          );
          await assert.rejects(
            () =>
              configuration.saveProvider(name, {
                factory: 'test',
                options: { headers: { authorization: 'Bearer plaintext' } },
              }),
            /AI_DATABASE_SECRET_FORBIDDEN/,
          );
          await assert.rejects(
            () =>
              configuration.saveProvider(name, {
                factory: 'test',
                options: { headers: { 'x-custom': 'plaintext' } },
              }),
            /AI_DATABASE_SECRET_HEADER_FORBIDDEN/,
          );
          await assert.rejects(
            () =>
              configuration.saveModel(name, {
                provider: 'default',
                modelId: 'test',
                providerOptions: { nested: { client: { apiKey: 'plaintext' } } },
              }),
            /AI_DATABASE_SECRET_FORBIDDEN/,
          );
          await assert.rejects(
            () =>
              configuration.saveScene('cabloy-ai:default', {
                providerOptions: { test: { options: { apiKey: 'plaintext' } } },
              }),
            /AI_DATABASE_SECRET_FORBIDDEN/,
          );
          for (const apiKey of ['', null, 1]) {
            await assert.rejects(() =>
              configuration.saveProvider(name, {
                factory: 'test',
                options: { apiKey: apiKey as never },
              }),
            );
          }
          assert.equal(await scope.model.aiProvider.get({ name }), undefined);
          await assert.rejects(
            () =>
              configuration.saveScene('cabloy-ai:not-registered' as keyof IAiSceneRecord, {
                aiModel: 'default',
              }),
            /AI_SCENE_NOT_REGISTERED/,
          );
          await assert.rejects(
            () => app.bean.ai.create('cabloy-ai:not-registered' as keyof IAiSceneRecord),
            /AI_SCENE_NOT_REGISTERED/,
          );
          await assert.rejects(
            () => configuration.saveModel(name, { provider: 'missing', modelId: 'test' }),
            /AI_PROVIDER_FACTORY_NOT_REGISTERED/,
          );
          await assert.rejects(() =>
            configuration.saveModel(name, {
              provider: 'default',
              modelId: 'test',
              generation: { temperature: null as never },
            }),
          );
          await assert.rejects(() =>
            configuration.saveModel(name, {
              provider: 'default',
              modelId: 'test',
              generation: { temperature: '0' as never },
            }),
          );
          assert.equal(await scope.model.aiModel.get({ name }), undefined);
          providerId = (
            await configuration.saveProvider(name, {
              factory: 'test',
              enabled: false,
              options: { apiKey: 'cabloy-ai-test-only-disabled-key-2c43' },
            })
          ).id;
          await assert.rejects(() => configuration.resolveProvider(name), /AI_PROVIDER_DISABLED/);
          // Read-side validation also rejects malformed/out-of-band persisted documents.
          await scope.model.aiProvider.update({
            id: providerId,
            overrides: {
              factory: 'test',
              options: { nested: { apiKey: 'plaintext' } },
            },
          });
          await assert.rejects(
            () => configuration.resolveProvider(name),
            /AI_DATABASE_SECRET_FORBIDDEN/,
          );
          await scope.model.aiProvider.update({
            id: providerId,
            overrides: {
              factory: 'test',
              options: { apiKey: '' },
            },
          });
          await assert.rejects(() => configuration.resolveProvider(name));
          sceneId = (await configuration.saveScene('cabloy-ai:default', { enabled: false })).id;
          await assert.rejects(
            () => app.bean.ai.create('cabloy-ai:default', { enabled: true } as never),
            /AI_SCENE_DISABLED/,
          );
        } finally {
          if (sceneId) await scope.model.aiScene.delete({ id: sceneId });
          if (providerId) await scope.model.aiProvider.delete({ id: providerId });
        }
      },
      { instanceName: 'shareTest' as never },
    );
  });
});
