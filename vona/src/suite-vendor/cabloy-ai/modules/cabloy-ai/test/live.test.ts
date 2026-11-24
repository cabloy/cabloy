import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { dirname } from 'node:path';
import { describe, it } from 'node:test';
import { promisify } from 'node:util';
import { assertTestAppIdentity } from 'vona-core';
import { app } from 'vona-mock';

// The managed unit app owns the existing listener and integrated SSR. No play route,
// extra runtime, credentials in subprocess arguments, or process-global overrides.
describe('cabloy-ai live browser qualification', { concurrency: false }, () => {
  it(
    'qualifies one configured provider through the full browser chat chain',
    {
      skip: process.env.CABLOY_AI_LIVE_VERIFY !== '1',
      timeout: 240_000,
    },
    async () => {
      const runId = assertTestAppIdentity(
        app.meta.env.META_MODE,
        app.meta.env.VONA_TEST_RUN_ID,
        app.name,
      );
      if (!app.meta.isTest || !runId)
        throw new Error('AI live qualification requires managed test mode');
      const alias = `live-${runId}`;
      const sceneName = 'cabloy-ai:default';
      let ownsConfiguration = false;
      let completed = false;
      let factory: string | undefined;
      try {
        try {
          await app.bean.executor.mockCtx(
            async () => {
              const scope = app.scope('cabloy-ai');
              // Qualify already-loaded deployment defaults, not dev-only env layers or
              // instance deployment overrides. Unsupported selections fail closed.
              const env = app.meta.env;
              factory = env.AI_PROVIDER_DEFAULT_FACTORY;
              const modelId = env.AI_MODEL_DEFAULT_MODELID;
              if (
                !['openai', 'anthropic', 'openaiCompatible'].includes(factory ?? '') ||
                !modelId ||
                modelId === 'test-model' ||
                (env.AI_MODEL_DEFAULT_PROVIDER && env.AI_MODEL_DEFAULT_PROVIDER !== 'default') ||
                (!env.AI_PROVIDER_DEFAULT_APIKEY && factory !== 'openaiCompatible') ||
                (factory === 'openaiCompatible' && !env.AI_PROVIDER_DEFAULT_BASEURL) ||
                typeof scope.config.providerFactories[factory!] !== 'function'
              ) {
                throw new Error('configuration');
              }
              if (
                (await scope.model.aiScene.get({ name: sceneName })) ||
                (await scope.model.aiModel.get({ name: alias })) ||
                (await scope.model.aiProvider.get({ name: alias }))
              ) {
                throw new Error('existing configuration');
              }
              ownsConfiguration = true;
              await scope.service.configuration.saveProvider(alias, {
                factory,
                enabled: true,
                options: {
                  ...(env.AI_PROVIDER_DEFAULT_APIKEY
                    ? { apiKey: env.AI_PROVIDER_DEFAULT_APIKEY }
                    : {}),
                  ...(env.AI_PROVIDER_DEFAULT_BASEURL
                    ? { baseURL: env.AI_PROVIDER_DEFAULT_BASEURL }
                    : {}),
                },
              });
              await scope.service.configuration.saveModel(alias, {
                provider: alias,
                modelId,
                enabled: true,
                generation: { maxOutputTokens: 64 },
                request: { maxRetries: 0, timeout: 30_000 },
              });
              await scope.service.configuration.saveScene(sceneName, {
                aiModel: alias,
                enabled: true,
                generation: { maxOutputTokens: 64 },
                request: { maxRetries: 0, timeout: 30_000 },
                limits: { maxInputCharacters: 1024, maxOutputTokens: 64, timeoutMs: 30_000 },
              });
              // Factory construction proves real selection without spending a request.
              const bound = await scope.service.configuration.create(sceneName);
              assert.equal(bound.identity.aiModel, alias);
              assert.equal(bound.identity.aiProvider, alias);
              assert.equal(bound.identity.modelId === modelId, true);
            },
            { instanceName: '' },
          );
        } catch {
          throw new Error('AI live qualification setup failed');
        }
        try {
          // Await asynchronously so this app continues serving the browser child.
          // Capture diagnostics: raw child errors/output must not expose credentials.
          const { stdout, stderr } = await promisify(execFile)(
            process.execPath,
            [
              'repo-e2e/scripts/runE2e.ts',
              'cabloy-ai-live',
              '--retries=0',
              '--max-failures=1',
              '--global-timeout=180000',
              '--trace=off',
            ],
            {
              cwd: dirname(app.projectPath),
              env: {
                ...Object.fromEntries(
                  Object.entries(process.env).map(([key, value]) => [key, String(value)]),
                ),
                CABLOY_AI_LIVE_PREPARED: runId,
              } as unknown as NodeJS.ProcessEnv,
              timeout: 200_000,
              maxBuffer: 4 * 1024 * 1024,
            },
          );
          const proof = `${stdout}\n${stderr}`
            .split('\n')
            .find(line => line.startsWith('{"check":"live-chat-chain",'));
          if (!proof) throw new Error('missing browser evidence');
          const counts = JSON.parse(proof);
          const expectedKeys = [
            'check',
            'browserSends',
            'textDeltas',
            'textCharacters',
            'runStatus',
            'savedMessages',
            'privateSsr',
            'hydrationErrors',
            'pageErrors',
            'replayTextDeltas',
          ];
          if (
            Object.keys(counts).some(key => !expectedKeys.includes(key)) ||
            counts.check !== 'live-chat-chain' ||
            counts.runStatus !== 'completed' ||
            counts.privateSsr !== true ||
            counts.browserSends !== 1 ||
            counts.savedMessages !== 2 ||
            counts.hydrationErrors !== 0 ||
            counts.pageErrors !== 0 ||
            counts.replayTextDeltas !== 0 ||
            !Number.isInteger(counts.textDeltas) ||
            counts.textDeltas < 1 ||
            !Number.isInteger(counts.textCharacters) ||
            counts.textCharacters < 1
          ) {
            throw new Error('invalid browser evidence');
          }
          console.warn(JSON.stringify(counts));
        } catch {
          throw new Error('AI live qualification browser child failed');
        }
        await app.bean.executor.mockCtx(
          async () => {
            assert.equal(
              Number(await app.scope('cabloy-ai').model.run.count({ where: { aiModel: alias } })),
              0,
            );
          },
          { instanceName: '' },
        );
        console.warn(
          JSON.stringify({
            check: 'live-chat-chain',
            factory,
            browserPassed: true,
            ownedRunsRemoved: true,
          }),
        );
        completed = true;
      } finally {
        if (ownsConfiguration) {
          try {
            await app.bean.executor.mockCtx(
              async () => {
                const scope = app.scope('cabloy-ai');
                const scene = await scope.model.aiScene.get({ name: sceneName });
                if (scene?.overrides.aiModel === alias)
                  await scope.model.aiScene.delete({ id: scene.id });
                const model = await scope.model.aiModel.get({ name: alias });
                if (model) await scope.model.aiModel.delete({ id: model.id });
                const provider = await scope.model.aiProvider.get({ name: alias });
                if (provider) await scope.model.aiProvider.delete({ id: provider.id });
                assert.equal(
                  (await scope.model.aiScene.get({ name: sceneName }))?.overrides.aiModel === alias,
                  false,
                );
                assert.equal(await scope.model.aiModel.get({ name: alias }), undefined);
                assert.equal(await scope.model.aiProvider.get({ name: alias }), undefined);
              },
              { instanceName: '' },
            );
          } catch {
            // Only fail an otherwise successful test; preserve any original failure.
            // eslint-disable-next-line no-unsafe-finally
            if (completed) throw new Error('AI live qualification configuration cleanup failed');
            console.warn('AI live configuration cleanup also failed; original failure preserved');
          }
        }
      }
    },
  );
});
