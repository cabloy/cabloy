import { simulateReadableStream } from 'ai';
import { MockLanguageModelV4 } from 'ai/test';

import type { IAiConfig } from '../types/config.ts';

export const testApiKey = 'cabloy-ai-test-only-config-key-74a9';

// Called only by config.ts in managed test mode. Never a fallback for deployment configuration.
export function testConfig(): Partial<IAiConfig> {
  return {
    providerFactories: {
      test: options => ({
        languageModel: modelId => {
          // Per-model capture for internal SDK assertions, never response text or raw errors.
          const providerMetadata = { test: { apiKey: options.apiKey ?? null } };
          const usage = {
            inputTokens: { total: 3, noCache: 3, cacheRead: 0, cacheWrite: 0 },
            outputTokens: { total: 4, text: 4, reasoning: 0 },
          };
          const finishReason = { unified: 'stop' as const, raw: 'stop' };
          return new MockLanguageModelV4({
            provider: 'cabloy-ai-test',
            modelId,
            doGenerate: async ({ prompt }) => {
              const message = prompt.filter(item => item.role === 'user').at(-1);
              const text =
                message?.content
                  .filter(item => item.type === 'text')
                  .map(item => item.text)
                  .join('') ?? '';
              if (text.includes('[error]') || text.includes('[title-error]'))
                throw new Error('Test provider failure');
              return {
                content: [{ type: 'text', text: `AI test response: ${text}` }],
                usage,
                finishReason,
                warnings: [],
                providerMetadata,
              };
            },
            doStream: async ({ prompt }) => {
              const message = prompt.filter(item => item.role === 'user').at(-1);
              const text =
                message?.content
                  .filter(item => item.type === 'text')
                  .map(item => item.text)
                  .join('') ?? '';
              if (text.includes('[error]')) throw new Error('Test provider failure');
              return {
                stream: simulateReadableStream({
                  initialDelayInMs: 0,
                  chunkDelayInMs: text.includes('[slow]') ? 1500 : 40,
                  chunks: [
                    { type: 'stream-start' as const, warnings: [] },
                    { type: 'text-start' as const, id: 'text-1' },
                    { type: 'text-delta' as const, id: 'text-1', delta: 'AI test response: ' },
                    ...[
                      text.slice(0, Math.ceil(text.length / 2)),
                      text.slice(Math.ceil(text.length / 2)),
                    ]
                      .filter(Boolean)
                      .map(delta => ({ type: 'text-delta' as const, id: 'text-1', delta })),
                    { type: 'text-end' as const, id: 'text-1' },
                    { type: 'finish' as const, usage, finishReason, providerMetadata },
                  ],
                }),
              };
            },
          });
        },
      }),
    },
    aiProviders: { default: { factory: 'test', options: { apiKey: testApiKey } } },
    aiModels: {
      default: {
        provider: 'default',
        modelId: 'test-model',
      },
    },
  };
}
